// SB Drive Confidential  For Your Eyes Only
// Do not copy, display, or use this document without the prior written authorization of SB Drive Corp.
// Copyright ©2017 SB Drive Corp. All rights reserved.

var SBDSpeedMeter = (function() {

var meter;
var label;
var arcScale;
var arc;
var p = Math.PI;

// コンストラクタ
function SBDSpeedMeter() {
// SVGの幅
var width = 235;
var height =300;
var radius=width*0.39;//半径がwidthの数字倍のメータを作成
var MnumberSize=radius*0.14//メーターの数字の大きさ
var startAngleRate = -1.4
var endAngleRate = 1.4

var svg = d3.select("#speed_meter").append("svg")
 .attr("width", width)
 .attr("height", height);

// 背景のグレーの円
svg.append("circle")
    .attr("cx",width/2)//フレーム内の円の中心のx座標の設定
    .attr("cy",height/2)//フレーム内の円の中心のy座標を設定
    .attr("r",radius)
    .attr("fill","#393f46");

// メーターのグループ
var translated = svg.append("g")
  .attr("transform","translate(" + width/2 + "," + height/2 + ")");

arc = d3.arc()
  .innerRadius(radius*0.77)
  .outerRadius(radius*0.95)
  .startAngle(startAngleRate * p/2); // ここはラジアン

// メーターの範囲を設定
arcScale = d3.scaleLinear()
    .domain([0 , 100])
    .range([startAngleRate*90, endAngleRate*90]); // ここは度

// メーターバー部分の追加
meter = translated.append("path")
    .datum({endAngle: startAngleRate*p/2})
    .style("fill", "#51d8ff")
    .attr("d", arc)

// 目盛の追加
// 0 を100個の5間隔で配列を作成
var ticks = d3.range(0, 105, 5);
// グループ要素を目盛数分追加する
var ticks_g = svg.selectAll(".tick").data(ticks).enter()
  .append("g")
  .attr("class","tick")
  .attr("transform",function(d,i){ return "translate(" + width/2 + "," + height/2 + ")"; });

// 目盛りの線
var ticksLine = d3.line()
  .x(0)
  .y(function(d) { return d; });

// 目盛りの追加
ticks_g.append("path")
  .attr("d", function(d){
    return ticksLine([-radius*0.95 , -radius*0.92]);
  }
  )
  .attr("stroke", "white")
  .attr("stroke-width",2.5)
  .attr("stroke-linecap","round")
  .attr("transform",function(d,i){ return "rotate(" + arcScale(d) + ")"; });

// ラベル 位置は角度から(x,y)を求めて、貼り付け
ticks_g.append("text")
  .attr("x",  function(d){ return radius*0.62 * Math.sin(arcScale(d) * (Math.PI / 180)); })
  .attr("y" , function(d){ return -radius*0.62 * Math.cos(arcScale(d) * (Math.PI / 180)) + 2; })
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .attr("font-size", MnumberSize+"px")
  .attr("font-family", "sans-serif")
  .text(function(d){ if(d % 10 == 0 ){ return d; }});

// 文字列表示
label = ticks_g.append("text")
  .attr("y",radius*0.22)
  .style("text-anchor","middle")
  .attr("fill","#51d8ff")
  .attr("font-size",MnumberSize*4.44+"px")
  .attr("font-family", "arial")
  .text(0)

// 単位表示
 ticks_g.append("text")
  .attr("y",radius*0.69)
  .style("text-anchor","middle")
  .attr("fill","white")
  .attr("font-size",MnumberSize*0.9+"px")
  .attr("font-family", "sans-serif")
  .text("km/h")
}

//角度をラジアンへ変換
var deg_to_rad= function(x){
  x=x*p/180
  return x;
};

//メータのアニメーションの関数
function arcTween(newAngle) {
  return function(d) {
    var interpolate = d3.interpolate(d.endAngle, newAngle);
    return function(t) {
      d.endAngle = interpolate(t);
      return arc(d);
    };
  };
}

// メータの更新
SBDSpeedMeter.prototype.update = function(value) {
  //数値の更新
  label.text(value);

  //メーターアニメ
  meter.transition()
    .duration(500)
    .attrTween("d", arcTween(deg_to_rad(arcScale(value))));
};

return SBDSpeedMeter;
})();
