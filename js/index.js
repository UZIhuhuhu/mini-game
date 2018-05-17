window.onload = () => {
  //存输入的challenge Number
  let challenge = new Array();

  //输入框页面 => 小游戏页面
  const skip = () => {
    const father = document.querySelector(`.mini-game`);
    const confirmBtn = document.querySelector(`.confirm-btn`);
    confirmBtn.addEventListener(`click`, () => {
      var numInput = document.querySelector(`.boat-num`);

      if (numInput.value != "") {
        if (!isNaN(Number(numInput.value))) {
          father.classList.add(`fadeOutLeft`);
          setTimeout(() => {
            document.body.removeChild(father);
            const gameContainer = document.querySelector(`.container`);
            gameContainer.style.display = `block`;
            gameContainer.classList.add(`zoomInDown`);
          }, 500);
        } else {
          father.classList.add(`shake`);
          setTimeout(() => {
            father.classList.remove(`shake`);
          }, 500);
          // console.log(`只能是数字`);
        }
      } else {
        father.classList.add(`rubberBand`);
        setTimeout(() => {
          father.classList.remove(`rubberBand`);
        }, 500);
        // console.log(`不能为空`);
      }
    });
  };
  skip();


  //生成表格
  const render = () => {
    const table = document.querySelector(`.table`);
    for (let i = 0; i < 8; i++) {
      table.innerHTML += `<tr></tr>`;
      var tr = document.querySelector(`tr`);
    }
    Array.from(document.querySelectorAll(`tr`)).map(x => {
      for (let j = 0; j < 15; j++) {
        x.innerHTML += `<th class="animated" choose="false"></th>`;
      }
    });
  };
  render();


  //得分
  var point = 0;
  var pointDom = document.querySelector(`.point`);
  var tbody = Array.from(document.querySelectorAll(`tbody tr th`));

  //挑战的分数
  if (localStorage.getItem(`challengeNumber`) != null) {
    var challengeNumber = localStorage.getItem(`challengeNumber`);
    //清除存储
    localStorage.removeItem(`boardNumber`);
  } else {
    var challengeNumber = 0;
  }

  //随机小船出现的动画
  const domAppear = (...arguments) => {
    //随机色
    var randomColor = [
      "#7986cb",
      "#64ffda",
      "#90a4ae",
      "#b3e5fc",
      "#fff9c4",
      "#9575cd"
    ];
    var randomColorIndex = Math.ceil(Math.random() * 6) - 1;
    [...arguments].forEach(element => {
      if (element != undefined) {
        element.style.backgroundColor = randomColor[randomColorIndex];
        element.classList.add(`jackInTheBox`);
        setTimeout(() => {
          element.classList.remove(`jackInTheBox`);
        }, 2000);
      }
    });
    return [...arguments];
  };

  //完成挑战的动画
  const winAnimation = (...arguments) => {
    [...arguments].forEach(element => {
      if (element != undefined) {
        element.style.backgroundColor = `#f44336`;
        element.classList.add(`jackInTheBox`);
        setTimeout(() => {
          element.classList.remove(`jackInTheBox`);
        }, 500);
        setTimeout(() => {
          element.style.backgroundColor = `#fff`;
          element.classList.add(`rollOut`);
        }, 600);
      }
    });
  };

  //小船消失的动画
  const domDisapper = (...arguments) => {
    return new Promise(resolve => {
      [...arguments].forEach(element => {
        if (element != undefined) {
          element.classList.add(`rollOut`);
          element.style.backgroundColor = `#fff`;
          setTimeout(() => {
            element.classList.remove(`rollOut`);
          }, 500);
        }
      });
    });
  };

  //分数增加
  const countPlus = (Point = 0) => {
    point += Point;
    pointDom.classList.add(`rubberBand`);
    pointDom.innerHTML = `Points:${Number(point)}`;
    // console.log(`point is ${point}`);
    setTimeout(() => {
      pointDom.classList.remove(`rubberBand`);
    }, 600);
    // if (point == challengeNumber) {
    //   setInterval(() => {
    //     let winRandom = Math.ceil(Math.random() * 120) - 1;
    //     winAnimation(
    //       tbody[winRandom],
    //       tbody[winRandom + 16],
    //       tbody[winRandom - 16]
    //     );
    //     point--;
    //   }, 400);
    //   if(point <=0){
    //     clearInterval();
    //   }
    // }
  };

  //所有的点击次数
  var clickNum = 0;
  //点击小船的次数
  var clickBoatNum = 0;
  //点击不是小船的次数
  var clickOther = 0;

  //每个方格点击都会记录次数
  tbody.forEach(x =>
    x.addEventListener(`click`, e => {
      clickNum++;
      e.currentTarget.id = Math.random();
      //点击后设置选中
      e.currentTarget.setAttribute(`choose`, true);

      //记下点击元素的id
      var boatIdArr = new Array();
      for (let i in boatAll) {
        if (i != undefined) {
          boatIdArr.push(boatAll[i].id);
        }
      }

      //过滤空值的元素 => 因为点击后才有id 所以根据crr数组的长度和小船的长度比较,就可以判断是否全部被打中
      var crr = boatIdArr.filter(i => i != "");

      //判断点击的元素是否是小船数组里的元素
      if (boatAll.includes(e.currentTarget)) {
        if (randomLength == 1) {
          clickBoatNum++;
        } else {
          if (crr.length < randomLength) {
            clickBoatNum = 1;
          } else {
            clickBoatNum = randomLength;
          }
        }
      } else {
        clickOther++;
      }

      /**
       * 打中的次数和小船的长度进行比较
       * 全部打中 Point+1
       *  小船长度>1&&打中次数小于长度 Point+0.5
       * 点击其他空格的次数 = 船的长度 Point-1
       */
      if (clickBoatNum == randomLength) {
        countPlus(1);
      } else if (
        clickNum == randomLength &&
        clickBoatNum < randomLength &&
        randomLength > 1 &&
        clickBoatNum > 0
      ) {
        countPlus(0.5);
      } else if (clickOther == randomLength) {
        countPlus(-1);
      }

      //点击次数超过小船长度 => 生成新的随机小船
      if (clickNum >= randomLength) {
        boatAll.forEach(y => {
          y.setAttribute(`choose`, false);
          domDisapper(y);
        });
        //小船的长度和小船的全部空格更新
        var result = randomBoat();
        randomLength = result.randomLength;
        boatAll = result.boatAll;

        //所有的点击次数重置
        clickNum = 0;
        //击中的次数重置
        clickBoatNum = 0;
        //点击其他空格的次数重置
        clickOther = 0;
      }
    })
  );



  
  //随机小船生成
  var randomBoat = function() {
    //随机点
    var randomDot = Math.ceil(Math.random() * 120) - 1;

    //随机方向 1 -> 横 2 -> 竖 3-> 斜
    var randomDirection = Math.ceil(Math.random() * 3);

    //完整小船的数组
    var boatAll = null;
    //随机长度
    var randomLength = Math.ceil(Math.random() * 4);

    // setInterval(function() {
    if (
      //去除边缘的计算
      (randomDot >= 16 && randomDot <= 28) ||
      (randomDot >= 31 && randomDot <= 43) ||
      (randomDot >= 46 && randomDot <= 58) ||
      (randomDot >= 61 && randomDot <= 73) ||
      (randomDot >= 76 && randomDot <= 88) ||
      (randomDot >= 91 && randomDot <= 103)
    ) {
      if (randomLength == 1) {
        boatAll = domAppear(tbody[randomDot]);
      } else if (randomLength == 2) {
        //方向分类
        switch (randomDirection) {
          case 1:
            boatAll = domAppear(tbody[randomDot], tbody[randomDot + 1]);
            break;
          case 2:
            boatAll = domAppear(tbody[randomDot], tbody[randomDot + 15]);
            break;
          case 3:
            boatAll = domAppear(tbody[randomDot], tbody[randomDot + 16]);
            break;
        }
      } else if (randomLength == 3) {
        if (randomDirection == 1 || randomDirection == 3) {
          boatAll = domAppear(
            tbody[randomDot],
            tbody[randomDot + 15],
            tbody[randomDot - 15]
          );
        } else {
          boatAll = domAppear(
            tbody[randomDot],
            tbody[randomDot + 16],
            tbody[randomDot - 16]
          );
        }
      } else if (randomLength == 4) {
        boatAll = domAppear(
          tbody[randomDot],
          tbody[randomDot + 1],
          tbody[randomDot + 2],
          tbody[randomDot + 3]
        );
      }
    } else if (
      (randomDot > 1 && randomDot < 15) ||
      (randomDot > 106 && randomDot < 120)
    ) {
      randomLength = 3;
      boatAll = domAppear(
        tbody[randomDot],
        tbody[randomDot + 1],
        tbody[randomDot - 1]
      );
    } else if (randomDot == 1) {
      randomLength = 4;
      boatAll = domAppear(
        tbody[randomDot],
        tbody[randomDot + 16],
        tbody[randomDot + 32],
        tbody[randomDot + 48]
      );
    } else if (randomDot == 15) {
      randomLength = 4;
      boatAll = domAppear(
        tbody[randomDot],
        tbody[randomDot + 14],
        tbody[randomDot + 28],
        tbody[randomDot + 42]
      );
    } else if (randomDot == 106) {
      randomLength = 4;
      boatAll = domAppear(
        tbody[randomDot],
        tbody[randomDot - 14],
        tbody[randomDot - 28],
        tbody[randomDot - 42]
      );
    } else if (randomDot == 120) {
      randomLength = 4;
      boatAll = domAppear(
        tbody[randomDot],
        tbody[randomDot - 16],
        tbody[randomDot - 32],
        tbody[randomDot - 48]
      );
    } else {
      randomLength = 1;
      boatAll = domAppear(tbody[randomDot]);
    }
    // }, 1000);
    return {
      randomLength: randomLength,
      boatAll: boatAll
    };
  };

  var { randomLength, boatAll } = randomBoat();

  // setInterval(randomBoat,2000);
};
