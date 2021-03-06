
// 给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。
// 一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。

// 示例 1:
// 输入: 12258
// 输出: 5
// 解释: 12258有5种不同的翻译，分别是"bccfi", "bwfi", "bczi", "mcfi"和"mzi"
// 提示：
// 0 <= num < 231
// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/ba-shu-zi-fan-yi-cheng-zi-fu-chuan-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

// 最后一位是8，和前面的2组合超过了25
// 1228
// dp1 = 1; 1
// dp2 = 2; 1,2 <=> 12
// dp3 = 3; 1, 2, 2 <=> 12, 2 <=> 1, 22
// dp4 = 3; 1, 2, 2, 8 <=> 12, 2, 8 <=> 1, 22, 8

// 最后一位是4， 和前面的2没有超过25
// 1224
// dp1 = 1; 1
// dp2 = 2; 1,2 <=> 12
// dp3 = 3; 1, 2, 2 <=> 12, 2 <=> 1, 22
// dp4 = 5； 1，2，2，4 <=> 12, 2, 4 <=> 1,22,4 <=> 12, 24 <=> 1, 2, 24

// 可以发现，如果最后两位超过了25，那么这个dp(n) = dp(n-1)
// 如果没有超过，首先dp(n-1) 里的所有情况，都可以直接加，4。 然后dp(n-2)里的所有情况，都可以加， 24
// 所以是dp(n) = dp(n-1) + dp(n-2);

var translateNum = function (num) {
    var str = num + '';
    var dp = [1];
    dp[-1] = 1;
    for (var i = 1; i < str.length; i++) {
        dp[i] = dp[i - 1];
        if (Number(str[i - 1]) && Number(str[i - 1] + '' + str[i]) < 26) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
    }
    return dp[str.length - 1];
};