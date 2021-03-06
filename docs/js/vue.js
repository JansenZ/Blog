// 首先，实现一个双向绑定，需要哪些步骤？
// 1.需要一个observer类，然后对需要监控的数据进行遍历define。
// 2.在define监察方法前，new一个新的消息管理器 dep
// 3.在get方法内，判断是否有消息管理器的target，有的话，调用
// 4.需要一个watcher，它有一个Update方法，一个get方法，获取对应的数据，让它来触发observer里的get，从而绑定
// 5.需要一个Dep，用来刚刚的收集和通知。同时，它也有一个depend方法，用来当watch get触发observerget，observerget里会调用dep.depend
// 6.depdenpend调用watcher的addDep，watcher的addDep里判断这个id绑定了没，如果没有的话，调用dep的addSubs（this）;

const Vue = (function() {
    let uid = 0;
    // 用于储存订阅者并发布消息
    class Dep {
      constructor() {
        // 设置id,用于区分新Watcher和只改变属性值后新产生的Watcher
        this.id = uid++;
        // 储存订阅者的数组
        this.subs = [];
      }
      // 触发target上的Watcher中的addDep方法,参数为dep的实例本身
      depend() {
        Dep.target.addDep(this);
      }
      // 添加订阅者
      addSub(sub) {
        this.subs.push(sub);
      }
      notify() {
        // 通知所有的订阅者(Watcher)，触发订阅者的相应逻辑处理
        this.subs.forEach(sub => sub.update());
      }
    }
    // 为Dep类设置一个静态属性,默认为null,工作时指向当前的Watcher
    Dep.target = null;
    // 监听者,监听对象属性值的变化
    class Observer {
      constructor(value) {
        this.value = value;
        this.walk(value);
      }
      // 遍历属性值并监听
      walk(value) {
        Object.keys(value).forEach(key => this.convert(key, value[key]));
      }
      // 执行监听的具体方法
      convert(key, val) {
        defineReactive(this.value, key, val);
      }
    }
  
    function defineReactive(obj, key, val) {
      const dep = new Dep();
      // 给当前属性的值添加监听
      let chlidOb = observe(val);
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => {
          // 只有有这个target实例的时候，才能订阅，防止重复获取数值，从而产生多次订阅
          if (Dep.target) {
            // 订阅数据
            dep.depend();
          }
          return val;
        },
        set: newVal => {
          if (val === newVal) return;
          val = newVal;
          // 对新值进行监听
          chlidOb = observe(newVal);
          // 通知所有订阅者，数值被改变了
          dep.notify();
        },
      });
    }
  
    function observe(value) {
      // 当值不存在，或者不是复杂数据类型时，不再需要继续深入监听
      if (!value || typeof value !== 'object') {
        return;
      }
      return new Observer(value);
    }
  
    class Watcher {
      constructor(vm, dataKey, cb) {
        this.depIds = {}; // hash储存订阅者的id,避免重复的订阅者
        this.vm = vm; // 被订阅的数据一定来自于当前Vue实例
        this.cb = cb; // 当数据更新时想要做的事情
        this.dataKey = dataKey; // 被订阅的数据
        this.val = this.get(); // 维护更新之前的数据
      }
      // 对外暴露的接口，用于在订阅的数据被更新时，由订阅者管理员(Dep)调用
      update() {
        this.run();
      }
      addDep(dep) {
        // 如果在depIds的hash中没有当前的id,可以判断是新Watcher,因此可以添加到dep的数组中储存
        // 此判断是避免同id的Watcher被多次储存
        if (!this.depIds.hasOwnProperty(dep.id)) {
          dep.addSub(this);
          this.depIds[dep.id] = dep;
        }
      }
      run() {
        const val = this.get();
        console.log(val);
        if (val !== this.val) {
          this.val = val;
          this.cb.call(this.vm, val);
        }
      }
      get() {
        // 当前订阅者(Watcher)读取被订阅数据的最新更新后的值时，通知订阅者管理员收集当前订阅者
        Dep.target = this;
        // 通过如下代码，可以触发对应数据的get
        const val = this.vm._data[this.dataKey];
        // 置空，用于下一个Watcher使用
        Dep.target = null;
        console.log(Dep.target, 2);
        return val;
      }
    }
  
    // 以下实际是包装，如果不需要，可以单写即可。
    class Vue {
      constructor(options = {}) {
        // 简化了$options的处理
        this.$options = options;
        // 简化了对data的处理
        let data = (this._data = this.$options.data);
        // 将所有data最外层属性代理到Vue实例上
        Object.keys(data).forEach(key => this._proxy(key));
        // 监听数据
        observe(data);
      }
      // 对外暴露调用订阅者的接口，内部主要在指令中使用订阅者
      $watch(expOrFn, cb) {
        new Watcher(this, expOrFn, cb);
      }
      // 这个主要是把data下的数据拉到表层用。
      _proxy(key) {
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: true,
          get: () => this._data[key],
          set: val => {
            this._data[key] = val;
          },
        });
      }
    }
  
    return Vue;
  })();
  
  let demo = new Vue({
    data: {
      text: '',
    },
  });
  
  const p = document.getElementById('p');
  const input = document.getElementById('input');
  
  input.addEventListener('keyup', function(e) {
    demo.text = e.target.value;
  });
  
  demo.$watch('text', str => p.innerHTML = str);
  

  // 草稿版
  // 可以不用看
  function observe(value, event) {
    // 当值不存在，或者不是复杂数据类型时，不再需要继续深入监听
    if (!value || typeof value !== 'object') {
      return;
    }
    return new Proxy(value, {
        set(target, key, value, receiver) {
            if(target[key] === value) return true;
            observe(value);
            event.notify();
            return target[key] = value;
        },
        // get(target, key, receiver) {
        //     if(Dep.target) {
        //         dep.depend();
        //     }
        //     return target[key];
        // }
    })
  }


  class event {
    constructor() {
      // 设置id,用于区分新Watcher和只改变属性值后新产生的Watcher
      this.id = uid++;
      // 储存订阅者的数组
      this.subs = [];
    }
    // 触发target上的Watcher中的addDep方法,参数为dep的实例本身
    depend() {
      Dep.target.addDep(this);
    }
    // 添加订阅者
    addSub(sub) {
      this.subs.push(sub);
    }
    notify() {
      // 通知所有的订阅者(Watcher)，触发订阅者的相应逻辑处理
      this.subs.forEach(sub => sub.update());
    }
  }

var data = { 
  name: 'k'
};

function watch(data, callback) {
  var event = new event();
  // 收集依赖
  event.add(callback);
  observe(data, event);
}

html.addEventListener(()=> {
  data.name = e.target;
})

watch(data, (key) => {
  if(key == 'name') {
      // html name 标签 变化。
  }
})