// DFS
// 深度优先，可能会有一些变种，但是呢，总体上来看，都是依靠子节点的遍历递归。

// 深度优先不需要记住所有的节点, 所以占用空间小, 而广度优先需要先记录所有的节点占用空间大
// 深度优先有回溯的操作(没有路走了需要回头)所以相对而言时间会长一点

// 深度优先就是树的访问的时候，是优先访问最深的节点的。
// 算法记忆点
// 节点的子节点数组进travel函数，然后forEach的时候，先res.push子节点的val
// 然后判断 子节点有没有子节点，如果有，递归调用travel即可

//返回第一个对象，通过next串联起来
function getDeepTree(node) {
    let res = node;
    let travel = (nodes) => {
        nodes.forEach((node) => {
            res.next = node;
            res = node;
            let child = node.child;
            child && travel(Array.isArray(child) ? child : [child]);
        });      
    }
    travel(node.child || []);
    return node;
}

// 返回val数组, 递归版本
function getDeepTree(node) {
    let res = [];
    let travel = (nodes) => {
        nodes.forEach((node) => {
            res.push(node.val);
            let child = node.child;
            child && travel(Array.isArray(child) ? child : [child]);
        });      
    }
    travel([node]);
    return node;
}
