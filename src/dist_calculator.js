import { last, drop, fill, concat } from "lodash"
import nj from 'https://cdn.jsdelivr.net/npm/@d4c/numjs/build/module/numjs.min.js'


function pad(arr, pad_width){
  arr = arr.tolist()
  arr = concat(
    fill(Array(pad_width), 0), arr, fill(Array(pad_width), 0)
  )
  return nj.array(arr)
}

function convolve(arr_a, arr_b) {
  var arr_b_length = arr_b.shape[0]
  var result_length = arr_a.shape[0] + arr_b_length - 1
  arr_b = arr_b.slice([null, null, -1])

  var padded_arr_a = pad(arr_a, arr_b_length - 1)
  var result = fill(Array(result_length), 0)

  for (let index = 0; index < result_length; index++) {
    result[index] = nj.sum(
      nj.multiply(
        padded_arr_a.slice([index, index + arr_b_length]), arr_b
      )
    )
  }
  return nj.array(result)
}

function cumsum(arr) {
  arr = arr.tolist()
  var result = [arr[0]]

  for (let index = 1; index < arr.length; index++) {
    result.push(last(result) + arr[index])
  }

  return nj.array(result)
}

function basicDist(cumulative_n=0) {
  const base_prob = 0.006
  const increase_prob = 0.06
  const threshold = 73

  var probs = []
  var cumulative_probs = [0]

  while(true) {
    cumulative_n += 1

    if (cumulative_n <= threshold) {
      probs.push(base_prob * (1 - last(cumulative_probs)))
      cumulative_probs.push(last(cumulative_probs) + last(probs))
    } else {
      let curr_prob = Math.min((cumulative_n - threshold)*increase_prob + base_prob, 1.0)
      probs.push(curr_prob * (1 - last(cumulative_probs)))
      cumulative_probs.push(last(cumulative_probs) + last(probs))
    }

    if (last(cumulative_probs) >= 1.0){
      return {
        probs: nj.array(probs),
        cumulative_probs: nj.array(drop(cumulative_probs))
      }
    }
  }
}

export function up5StarCharacterDist(item_nums=1, cumulative_n=0, is_up_pity=false){
  if (item_nums == 1) {
    if (is_up_pity) {
      var dist = basicDist(cumulative_n)
      return dist
    } else {
      var dist1 = basicDist(cumulative_n)
      var dist2 = basicDist()
      
      var with_pity_part_probs = nj.concatenate(
        nj.array([0.0]), convolve(dist1.probs, dist2.probs)
      ).multiply(0.5)

      var without_pity_part_probs = nj.concatenate(
        dist1.probs.multiply(0.5), nj.array(fill(Array(90), 0.0))
      )

      var probs = nj.add(with_pity_part_probs, without_pity_part_probs)
      var cumulative_probs = cumsum(probs)
      
      return {
        probs: probs,
        cumulative_probs: cumulative_probs
      }
    }
  } else {
    var dist1 = up5StarCharacterDist(1, cumulative_n, is_up_pity)
    var probs = dist1.probs
    for (let index = 0; index < item_nums - 1; index++) {
      var dist_i = up5StarCharacterDist(1)
      probs = convolve(probs, dist_i.probs)
    }

    var cumulative_probs = cumsum(probs)
    return {
      probs: probs,
      cumulative_probs: cumulative_probs
    }
  }
}
