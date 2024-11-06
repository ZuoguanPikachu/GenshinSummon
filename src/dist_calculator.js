import { last, drop, fill, concat, sum, reverse, slice } from "lodash"


function add(arr_a, arr_b) {
  var length = arr_a.length
  var result = Array(length)

  for (let index = 0; index < length; index++) {
    result[index] = arr_a[index] + arr_b[index]
  }
  return result
}

function multiply(arr_a, arr_b) {
  var length = arr_a.length
  var result = Array(length)

  if (arr_b.length == 1) {
    let k = arr_b[0];
    for (let index = 0; index < length; index++) {
      result[index] = arr_a[index] * k
    }
  } else {
    for (let index = 0; index < length; index++) {
      result[index] = arr_a[index] * arr_b[index]
    }
  }
  return result
}

function pad(arr, pad_width){
  var result = concat(
    fill(Array(pad_width), 0), arr, fill(Array(pad_width), 0)
  )
  return result
}

function convolve(arr_a, arr_b) {
  var arr_b_length = arr_b.length
  var result_length = arr_a.length + arr_b_length - 1
  arr_b = reverse(arr_b)

  var padded_arr_a = pad(arr_a, arr_b_length - 1)
  var result = Array(result_length)

  for (let index = 0; index < result_length; index++) {
    result[index] = sum(
      multiply(
        slice(padded_arr_a, index, index + arr_b_length), arr_b
      )
    )
  }
  return result
}

function cumsum(arr) {
  var result = [arr[0]]

  for (let index = 1; index < arr.length; index++) {
    result.push(last(result) + arr[index])
  }

  return result
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
        probs: probs,
        cumulative_probs: drop(cumulative_probs)
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
      
      var with_pity_part_probs = multiply(
        concat([0.0], convolve(dist1.probs, dist2.probs)),
        [0.5]
      )
      var without_pity_part_probs = concat(
        multiply(dist1.probs, [0.5]), fill(Array(90), 0.0)
      )

      var probs = add(with_pity_part_probs, without_pity_part_probs)
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
