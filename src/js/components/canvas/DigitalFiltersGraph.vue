<template>
  <div style="width={{ graphWidth }};max_width={{  graphWidth}};">
    <canvas
      :id="title"
      onload="clear_canvas()"
      :width="graphWidth"
      :height="graphHeight"
    />
  </div>
</template>

<script>
export default {
  name: "VueGraph",
  props: {
    title: {
      type: String,
      default: ""
    },
    graphWidth: {
      type: Number,
      default: 500
    },
    graphHeight: {
      type: Number,
      default: 500
    },
    originX: {
      type: Number,
      default: 500
    },
    originY: {
      type: Number,
      default: 250
    },
    data: {
      type: Array,
      default: () => ([])
    },
    xLabel: {
      type: String,
      default: "Normalizirana frekvenca"
    },
    yLabel: {
      type: String,
      default: "Magnituda[dB]"
    },
    yLabelPos: {
      type: Number,
      default: 10
    },
    mirror: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      animation: false,
      cdim: {w: 500, h: 500},
      ccen: {w: 250, h: 250},
      mdim: {w: 5, h: 5},
      sg_1_color: "#0abaf5",
      guide_line_color: "#ffffff",
      m_width: 5,
      m_height: 5,
      bg_color: "#232936",
      autoscale: true,
      animation_loop: false,
      sg_1_width: 3,
      sg_2_color: "#e00202",
    }
  },

  mounted() {
    setup(this.title, this.graphWidth, this.graphHeight, this.originX, 
          this.originY, this.m_width, this.m_height, this.animation, 
          this.animation_loop, this.xLabel, this.yLabel, this.mirror);
    misc_setup(this.bg_color, this.guide_line_color, this.sg_1_color, this.sg_1_width);
    clear_canvas();
    draw_guide_lines();
    this.test();
  },

  updated() {
    this.test();
  },

  methods: {
    test() {
      let x_min = +10000000;
      let x_max = -10000000;
      let y_min = 10000000;
      let y_max = -10000000;

      if (this.autoscale) {
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].x <= x_min) {
            x_min = this.data[i].x;
          }
        }

        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].x >= x_max) {
            x_max = this.data[i].x;
          }
        }

        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].y >= y_max) {
            y_max = this.data[i].y;
          }
        }

        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].y <= y_min) {
            y_min = this.data[i].y;
          }
        }

        const dx = x_max - x_min;
        const dy = y_max - y_min;
        const mw = dx + dx * 0.2;
        let mh = dy + dy * 0.4;
        const cx = 1;
        let cy = 50;
        if (mh !== 0) {
          cy = (y_max) * (this.graphHeight) / mh + 40;
        }

        if (cy >= this.graphHeight) {
          mh += (cy + 20 - this.graphHeight) / this.graphHeight;
          cy = this.graphHeight - 20;
        }

        auto_scale(mw, mh, cx, cy);
      }
      draw();
    }
  },
}

let animation = false;
let animation_loop = false;
let bg_color = "#000000";
let cdim = {w: 100, h: 100};
let ccen = {w: 50, h: 50};
let mdim = {w: 3, h: 3};
let title = "graph_1"
let x_lable = "NAAAAAAAAA";
let y_lable = "NA";
let y_lable_pos = 0;

let anim_timer;
let mirror = false;
const signal_1 = [];
let signal_1_canvas = [];
let signal_1_color = "#ffffff";
let signal_1_width = 3;
const signal_1_enable = false;

let signal_1_index = 0;

const signal_step_x = 3;
let signal_anim_x = 0;

function auto_scale(mw, mh, ox, oy) {
  if (mh === 0) {
    mdim = {w: 1.5, h: 2};
  } else {
    mdim = {w: mw, h: mh};
  }
  ccen = {w: ox, h: oy};
}

function setup(t, graphWidth, graphHeight, originX, originY, m_width, m_height, anim, loop, xl, yl, m, ylp) {
  mirror = m;
  title = t;
  cdim = {w: graphWidth, h: graphHeight};
  ccen = {w: originX, h: originY};
  mdim = {w: m_width, h: m_height};
  animation = anim;
  animation_loop = loop;
  x_lable = xl;
  y_lable = yl;
  y_lable_pos = ylp;
}

function draw() {
  if (anim_timer != null) {
    clearTimeout(anim_timer);
  }

  const sig = signal_1;
  const sig_canvas = [];

  for (let i = 0; i < sig.length; i++) {
    sig_canvas.push(math_to_canvas(sig[i]));
  }

  signal_1_canvas = sig_canvas;

  if (!animation)
    draw_signals();
  if (animation)
    draw_anim_start();
}

function draw_signals() {
  const ctx = get_canvas();
  ctx.globalAlpha = 1;
  clear_canvas();
  draw_guide_lines();

  ctx.strokeStyle = signal_1_color;
  ctx.lineWidth = signal_1_width;

  for (let i = signal_1_index; i < signal_1_canvas.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(signal_1_canvas[i].x, signal_1_canvas[i].y);
    ctx.lineTo(signal_1_canvas[i + 1].x, signal_1_canvas[i + 1].y);
    ctx.stroke();
  }
  if (mirror) {
    const sig_mirror = [];
    const sig_mirror_canvas = [];
    for (let i = 0; i < signal_1.length; i++) {
      sig_mirror.push({x: 2 - signal_1[signal_1.length - 1 - i].x, y: signal_1[signal_1.length - 1 - i].y});
      sig_mirror_canvas.push(math_to_canvas(sig_mirror[i]));
    }
    for (let i = signal_1_index; i < signal_1_canvas.length - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(sig_mirror_canvas[i].x, sig_mirror_canvas[i].y);
      ctx.lineTo(sig_mirror_canvas[i + 1].x, sig_mirror_canvas[i + 1].y);
      ctx.stroke();
    }
  }
}

function draw_anim_start() {
  signal_1_index = 0;
  signal_anim_x = 0;
  clear_canvas();
  draw_guide_lines();
  anim_timer = setTimeout(draw_anim, 10);
}

function draw_anim() {
  const anim_limit = signal_anim_x + signal_step_x;
  const ctx = get_canvas();

  if (signal_1_enable) {
    ctx.strokeStyle = signal_1_color;
    ctx.lineWidth = signal_1_width;

    for (let i = signal_1_index; i < signal_1_canvas.length - 1; i++) {
      if (signal_1_canvas[i].x >= signal_anim_x) {
        signal_1_index = i;
        break;
      }
      ctx.beginPath();
      ctx.moveTo(signal_1_canvas[i].x, signal_1_canvas[i].y);
      ctx.lineTo(signal_1_canvas[i + 1].x, signal_1_canvas[i + 1].y);
      ctx.stroke();
    }
  }

  signal_anim_x = anim_limit;
  if (signal_anim_x <= cdim.w) {
    anim_timer = setTimeout(draw_anim, 10);
  } else {
    if (animation_loop) {
      anim_timer = setTimeout(draw_anim_start, 3000);
    }
  }
}

function misc_setup(bgc, glc, sg1c, sg1w) {
  const ctx = get_canvas(title);
  ctx.imageSmoothingEnable = false;
  bg_color = bgc;
  signal_1_color = sg1c;
  signal_1_width = sg1w;
}

function get_canvas() {
  const c = document.getElementById(title);
  return c.getContext("2d");
}

function clear_canvas() {
  const ctx = get_canvas()
  ctx.globalAlpha = 1;
  ctx.fillStyle = bg_color;
  ctx.fillRect(0, 0, cdim.w, cdim.h);
  ctx.globalAlpha = 0;
  ctx.fillStyle = bg_color;
  ctx.fillRect(0, 0, cdim.w, cdim.h);
  ctx.globalAlpha = 1;
}

function math_to_canvas(point) {
  const x = ((point.x) / (mdim.w)) * cdim.w + ccen.w;
  const y = ((-point.y) / (mdim.h)) * cdim.h + ccen.h;
  return {x: x, y: y};
}

function draw_guide_lines() {
  const ctx = get_canvas();

  //x_axis_setup
  const unit_len_w = cdim.w / mdim.w;
  const num_unit_neg_w = (ccen.w) / unit_len_w;
  const num_unit_pos_w = (cdim.w - ccen.w) / unit_len_w;
  const unit_len_max = 240;
  const unit_len_min = 30;
  let step_x = 1;
  let step_y = 1;
  //y_axis_setup
  const unit_len_h = cdim.h / mdim.h;
  const num_unit_neg_h = (cdim.h - ccen.h) / unit_len_h;
  const num_unit_pos_h = (ccen.h) / unit_len_h;

  if (unit_len_h >= unit_len_max) {
    step_y = 0.1;
  } else if (unit_len_h < unit_len_min) {
    step_y = 10;
    if (unit_len_h * step_y < unit_len_min) {
      step_y = 20;
    }
  }

  const x_axis_start = {x: -num_unit_neg_w, y: 0};
  const x_axis_end = {x: num_unit_pos_w, y: 0};

  let c_start = math_to_canvas(x_axis_start, cdim, ccen, mdim);
  let c_end = math_to_canvas(x_axis_end, cdim, ccen, mdim);

  if (unit_len_w >= unit_len_max) {
    step_x = 0.1;
    while (unit_len_w * step_x >= unit_len_max) {
      step_x = step_x / 10;
    }
  } else if (unit_len_w < unit_len_min) {
    step_x = 10;
    while (unit_len_w * step_x < unit_len_min) {
      step_x = step_x * 10;
    }
  }

  ctx.beginPath();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1;
  ctx.moveTo(c_start.x, c_start.y);
  ctx.lineTo(c_end.x, c_end.y);
  ctx.stroke();

  //draw y_axis
  const y_axis_start = {x: 0, y: num_unit_pos_h};
  const y_axis_end = {x: 0, y: -num_unit_neg_h};

  c_start = math_to_canvas(y_axis_start, cdim, ccen, mdim);
  c_end = math_to_canvas(y_axis_end, cdim, ccen, mdim);

  ctx.beginPath();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1;
  ctx.moveTo(c_start.x, c_start.y);
  ctx.lineTo(c_end.x, c_end.y);
  ctx.stroke();

  for (let i = step_y; i < num_unit_neg_h; i += step_y) {
    draw_helper_h(-i, cdim, ccen, mdim);
    draw_helper_line_h(-i, cdim, ccen, mdim);
  }

  draw_y_lable();
  for (let i = step_y; i <= num_unit_pos_h; i += step_y) {
    draw_helper_h(i, cdim, ccen, mdim);
    draw_helper_line_h(i, cdim, ccen, mdim);
  }

  for (let i = step_x; i < num_unit_neg_w; i += step_x) {
    draw_helper_v(-i, cdim, ccen, mdim);
    draw_helper_line_v(-i, cdim, ccen, mdim);
  }
  for (let i = step_x; i <= num_unit_pos_w; i += step_x) {
    draw_helper_v(i, cdim, ccen, mdim);
    draw_helper_line_v(i, cdim, ccen, mdim);
  }
  draw_x_lable();
}

function draw_y_lable() {
  const ctx = get_canvas();
  ctx.fillStyle = "#ffffff";
  ctx.font = "25px Arial";
  ctx.fillText(y_lable, 75, cdim.h - y_lable_pos);
}

function draw_x_lable() {
  const ctx = get_canvas();
  ctx.fillStyle = "#ffffff";
  ctx.font = "25px Arial";
  ctx.fillText(x_lable, cdim.w - (x_lable.length) * 12.5, ccen.h - 5);
}

function draw_helper_line_h(y, cdim, ccen, mdim) {
  const math_point = {x: 0, y: y};
  const canvas_point = math_to_canvas(math_point, cdim, ccen, mdim);
  const ctx = get_canvas();

  ctx.beginPath();
  ctx.strokeStyle = "#EDEDED";
  ctx.lineWidth = 1;
  ctx.moveTo(canvas_point.x - 5, canvas_point.y);
  ctx.lineTo(canvas_point.x + 5, canvas_point.y);
  ctx.stroke();

  const i = fix_num_error(y, false);

  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial";
  ctx.fillText(i, canvas_point.x + 8, canvas_point.y);
}

function draw_helper_line_v(x, cdim, ccen, mdim) {
  const math_point = {x: x, y: 0};
  const canvas_point = math_to_canvas(math_point, cdim, ccen, mdim);
  const ctx = get_canvas();

  ctx.beginPath();
  ctx.strokeStyle = "#EDEDED";
  ctx.lineWidth = 1;
  ctx.moveTo(canvas_point.x, canvas_point.y - 5);
  ctx.lineTo(canvas_point.x, canvas_point.y + 5);
  ctx.stroke();
  const i = fix_num_error(x, true);
  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial";
  ctx.fillText(i, canvas_point.x, canvas_point.y + 16);
}

function draw_helper_v(x, cdim, ccen, mdim) {
  const math_point = {x: x, y: 0};
  const canvas_point = math_to_canvas(math_point, cdim, ccen, mdim);
  const ctx = get_canvas();

  ctx.beginPath();
  ctx.strokeStyle = "#BBBBBB";
  ctx.lineWidth = 0.5;
  ctx.moveTo(canvas_point.x, 0);
  ctx.lineTo(canvas_point.x, cdim.h);
  ctx.stroke();
}

function draw_helper_h(y, cdim, ccen, mdim) {
  const math_point = {x: 0, y: y};
  const canvas_point = math_to_canvas(math_point, cdim, ccen, mdim);
  const ctx = get_canvas();

  ctx.beginPath();
  ctx.strokeStyle = "#BBBBBB";
  ctx.lineWidth = 0.5;
  ctx.moveTo(0, canvas_point.y);
  ctx.lineTo(cdim.w, canvas_point.y);
  ctx.stroke();
}

function fix_num_error(i, x) {
  if (x) {
    return i.toFixed(1);
  }

  if (Math.abs(i) >= 1.3) {
    return i.toFixed(0);
  }

  if (Math.abs(i) >= 0.1) {
    return i.toFixed(1);
  }

  return i.toFixed(2);
}

</script>