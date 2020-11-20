module.exports = function filBalance(arr, ob) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].userId.balance > 0) {
            ob.push(arr[i])
        }
    }
    return ob
}
