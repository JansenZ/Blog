// 给你一根长度为 n 的绳子，请把绳子剪成整数长度的 m 段（m、n都是整数，n>1并且m>1），每段绳子的长度记为 k[0],k[1]...k[m] 。
// 请问 k[0]*k[1]*...*k[m] 可能的最大乘积是多少？例如，当绳子的长度是8时，我们把它剪成长度分别为2、3、3的三段，此时得到的最大乘积是18。

// 答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

// 示例 1：
// 输入: 2
// 输出: 1
// 解释: 2 = 1 + 1, 1 × 1 = 1

// 示例 2:
// 输入: 10
// 输出: 36
// 解释: 10 = 3 + 3 + 4, 3 × 3 × 4 = 36

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/jian-sheng-zi-ii-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

/**
 * @param {number} n
 * @return {number}
 */

var cuttingRope = function(m) {
    let n = BigInt(m);
    if(n == 2) {
        return 1;
    }
    if(n == 3) {
        return 2;
    }
    var count = n / 3n;
    var rest = n % 3n;
    if(rest == 0) {
        return (3n ** count) % (1000000007n);
    }
    if(rest == 1) {
        return ((3n ** (count - 1n)) * 4n) % (1000000007n);
    }
    if(rest == 2) {
        return ((3n ** count) * 2n) % (1000000007n);
    }
};