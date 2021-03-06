// n 皇后问题研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。

// 上图为 8 皇后问题的一种解法。

// 给定一个整数 n，返回所有不同的 n 皇后问题的解决方案。

// 每一种解法包含一个明确的 n 皇后问题的棋子放置方案，该方案中 'Q' 和 '.' 分别代表了皇后和空位。

// 示例:

// 输入: 4
// 输出: [
//  [".Q..",  // 解法 1
//   "...Q",
//   "Q...",
//   "..Q."],

//  ["..Q.",  // 解法 2
//   "Q...",
//   "...Q",
//   ".Q.."]
// ]
// 解释: 4 皇后问题存在两个不同的解法。

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/n-queens
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function(n) {
    var arr = [];
    var arr2 = [];
    searchQ(0, arr, arr2, n);
    return arr2;
};

function searchQ(row, arr, arr2, n) {
    if(row == n) {
        arr2.push(arr.map((k)=> '.'.repeat(k) + 'Q' + '.'.repeat(n - k - 1)));
    }
    for(var col = 0; col < n; col++) {
        if(isOK(row, col, arr)) {
            arr[row] = col;
            searchQ(row + 1, arr, arr2, n);
        }
    }
}

function isOK(row, col, arr) {
    for(var i = 0; i < row; i ++) {
        if(arr[i] == col || arr[i] + i == col + row || arr[i] - i == col - row) {
            return false;
        }
    }
    return true;
}