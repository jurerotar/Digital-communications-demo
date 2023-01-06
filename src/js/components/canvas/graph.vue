<template>
    <canvas onload="clear_canvas()" :id="title" :width="g_width" :height="g_height">adasd</canvas>
</template>

<script>

    /* eslint-disable */
    export default{
        defineExpose:["test"],
        name:"vue_graph",
        props:{
            trig_draw:false,
            title:String,
            g_width:{
                type:Number,
                default:500
            },
            g_height:{
                type:Number,
                default:500
            },
            o_x:{
                type:Number,
                default:500
            },
            o_y:{
                type:Number,
                default:250
            },
            m_width:{
                type:Number,
                default:5
            },
            m_height:{
                type:Number,
                default:5
            },
            bg_color:{
                type:String,
                default:"#222222"
            },
            guide_line_color:{
                type:String,
                default:"#ffffff"
            },
            animation:{
                type:Boolean,
                default:true
            },
            animation_loop:{
                type:Boolean,
                default:true
            },
            signal_1:{
                type:Array,
                default:[]
            },
            signal_2:{
                type:Array,
                default:[]
            },
            signal_3:{
                type:Array,
                default:[]
            },
            sg_1_color:{
                type:String,
                default:"#015e8c"
            },
            sg_1_width:{
                type:Number,
                default:3
            },
            sg_2_color:{
                type:String,
                default:"#e00202"
            },
            sg_2_width:{
                type:Number,
                default:3
            },
            sg_3_color:{
                type:String,
                default:"#018c3d"
            },
            sg_3_width:{
                type:Number,
                default:3
            },
        },
        watch:{
            trig_draw(){
                console.log("draw_graph");
                this.test();
                
            }
        },
        methods:{
            test(){
                console.log(this.signal_3.length);
                signal_1 = this.signal_1;
                signal_2 = this.signal_2;
                signal_3 = this.signal_3;
                
                draw();
            }
        },

        mounted(){
            
            setup(this.title,this.g_width,this.g_height,this.o_x,this.o_y,this.m_width,this.m_height,this.animation,this.animation_loop);
            misc_setup(this.bg_color,this.guide_line_color,
            this.sg_1_color,this.sg_1_width,
            this.sg_2_color,this.sg_2_width,
            this.sg_3_color,this.sg_3_width);
            clear_canvas();
            draw_guide_lines();
        },

        
    }

    var animation = false;
    var animation_loop = false;
    var bg_color = "#000000";
    var guide_line_color = "#ffffff";
    var cdim = {w:100,h:100};
    var ccen = {w:50,h:50};
    var mdim = {w:3,h:3};
    var title = "graph_1"

    var anim_timer;

    var signal_1 = [];
    var signal_1_canvas = [];
    var signal_1_color = "#ffffff";
    var signal_1_width = 3;
    var signal_1_enable = false;

    var signal_1_index = 0;

    var signal_2 = [];
    var signal_2_canvas = [];
    var signal_2_color = "#ffffff";
    var signal_2_width = 3;
    var signal_2_enable = false;

    var signal_2_index = 0;

    var signal_3 = [];
    var signal_3_canvas = [];
    var signal_3_color = "#ffffff";
    var signal_3_width = 3;
    var signal_3_enable = false;

    var signal_3_index = 0;

    var signal_step_x = 3;
    var signal_anim_x = 0;

    function setup(t,g_width,g_height,ox,oy,m_width,m_height,anim,loop){
        title = t;
        cdim = {w:g_width,h:g_height};
        ccen = {w:ox,h:oy};
        mdim = {w:m_width,h:m_height};
        animation = anim;
        animation_loop = loop;
    }

    function draw(){
        if(anim_timer != null){
            clearTimeout(anim_timer);
        }
        var sig = signal_1;
        var sig_canvas = [];
        signal_1_enable = sig.length > 0;
        console.log(signal_1_color);
        for(var i = 0; i < sig.length; i++){
            sig_canvas.push(math_to_canvas(sig[i]));   
        }
        signal_1_canvas = sig_canvas;

        sig = signal_2;
        sig_canvas = [];
        signal_2_enable = sig.length > 0;
        for(var i = 0; i < sig.length; i++){
            sig_canvas.push(math_to_canvas(sig[i]));   
        }
        signal_2_canvas = sig_canvas;

        sig = signal_3;
        sig_canvas = [];
        signal_3_enable = sig.length > 0;
        for(var i = 0; i < sig.length; i++){
            sig_canvas.push(math_to_canvas(sig[i]));   
        }
        signal_3_canvas = sig_canvas;
        if(!animation)
        draw_signals();
        if(animation)
        draw_anim_start();
    }

    function draw_signals(){
        var ctx = get_canvas();
        clear_canvas();
        draw_guide_lines();
        if(signal_1_enable){
            ctx.strokeStyle = signal_1_color;
            ctx.lineWidth = signal_1_width;
            for(var i = signal_1_index; i < signal_1_canvas.length-1; i++){
                ctx.beginPath();
                ctx.moveTo(signal_1_canvas[i].x,signal_1_canvas[i].y);
                ctx.lineTo(signal_1_canvas[i+1].x,signal_1_canvas[i+1].y);
                ctx.stroke();
            }
        }
        if(signal_2_enable){
            ctx.strokeStyle = signal_2_color;
            ctx.lineWidth = signal_2_width;
            for(var i = signal_2_index; i < signal_2_canvas.length-1; i++){
                ctx.beginPath();
                ctx.moveTo(signal_2_canvas[i].x,signal_2_canvas[i].y);
                ctx.lineTo(signal_2_canvas[i+1].x,signal_2_canvas[i+1].y);
                ctx.stroke();
            }
        }
        if(signal_3_enable){
            ctx.strokeStyle = signal_3_color;
            ctx.lineWidth = signal_3_width;
            for(var i = signal_3_index; i < signal_3_canvas.length-1; i++){
                ctx.beginPath();
                ctx.moveTo(signal_3_canvas[i].x,signal_3_canvas[i].y);
                ctx.lineTo(signal_3_canvas[i+1].x,signal_3_canvas[i+1].y);
                ctx.stroke();
            }
        }
        $emit("draw_finish");
    }


    function draw_anim_start(){
        signal_1_index = 0;
        signal_2_index = 0;
        signal_3_index = 0;
        signal_anim_x = 0;
        clear_canvas();
        draw_guide_lines();
        anim_timer = setTimeout(draw_anim,10);
    }

    function draw_anim(){
        var anim_limit = signal_anim_x+signal_step_x;
        var ctx = get_canvas();

        if(signal_1_enable){
            ctx.strokeStyle=signal_1_color;
            ctx.lineWidth=signal_1_width;
            for(var i = signal_1_index; i < signal_1_canvas.length-1; i++){
                if(signal_1_canvas[i].x >= signal_anim_x){
                    signal_1_index = i;
                    break;
                }
                ctx.beginPath();
                ctx.moveTo(signal_1_canvas[i].x,signal_1_canvas[i].y);
                ctx.lineTo(signal_1_canvas[i+1].x,signal_1_canvas[i+1].y);
                ctx.stroke();
            }
        }
        if(signal_2_enable){
            ctx.strokeStyle=signal_2_color;
            ctx.lineWidth=signal_2_width;
            for(var i = signal_2_index; i < signal_2_canvas.length-1; i++){
                if(signal_2_canvas[i].x >= signal_anim_x){
                    signal_2_index = i;
                    break;
                }
                ctx.beginPath();
                ctx.moveTo(signal_2_canvas[i].x,signal_2_canvas[i].y);
                ctx.lineTo(signal_2_canvas[i+1].x,signal_2_canvas[i+1].y);
                ctx.stroke();
            }
        }
        if(signal_3_enable){
            ctx.strokeStyle=signal_3_color;
            ctx.lineWidth=signal_3_width;
            for(var i = signal_3_index; i < signal_3_canvas.length-1; i++){
                if(signal_3_canvas[i].x >= signal_anim_x){
                    signal_3_index = i;
                    break;
                }
                ctx.beginPath();
                ctx.moveTo(signal_3_canvas[i].x,signal_3_canvas[i].y);
                ctx.lineTo(signal_3_canvas[i+1].x,signal_3_canvas[i+1].y);
                ctx.stroke();
            }
        }
        signal_anim_x = anim_limit;
        if(signal_anim_x <= cdim.w){
            anim_timer = setTimeout(draw_anim,10);
        }else{
            if(animation_loop){
                anim_timer = setTimeout(draw_anim_start,3000);
            }
        }  
    }

    function misc_setup(bgc,glc,sg1c,sg1w,sg2c,sg2w,sg3c,sg3w){
        bg_color = bgc;
        guide_line_color = glc;
        signal_1_color = sg1c;
        signal_1_width = sg1w;
        signal_2_color = sg2c;
        signal_2_width = sg2w;
        signal_3_color = sg3c;
        signal_3_width = sg3w;
    }

    function get_canvas(){
	var c = document.getElementById(title);
	return c.getContext("2d");
    }

    function clear_canvas(){
        console.log("clear_canvas");
        var ctx = get_canvas()
        ctx.fillStyle = bg_color;
	    ctx.fillRect(0,0,cdim.w,cdim.h);
    }

    function math_to_canvas(point){
	var x = ((point.x)/(mdim.w))*cdim.w+ccen.w;
	var y = ((-point.y)/(mdim.h))*cdim.h+ccen.h;
	return {x:x,y:y};
    }

    function draw_guide_lines(){
	var ctx = get_canvas();
    
	//x_axis_setup
	var unit_len_w = cdim.w/mdim.w;
	var num_unit_neg_w = (ccen.w)/unit_len_w;
	var num_unit_pos_w = (cdim.w-ccen.w)/unit_len_w;
	
    console.log(unit_len_w);
    console.log(ccen.w);
    console.log(num_unit_pos_w);

	//y_axis_setup
	var unit_len_h = cdim.h/mdim.h;
	var num_unit_neg_h = (cdim.h-ccen.h)/unit_len_h;
	var num_unit_pos_h = (ccen.h)/unit_len_h;

	//draw x_axis
	var x_axis_start = {x:-num_unit_neg_w,y:0};
	var x_axis_end = {x:num_unit_pos_w,y:0};

	var c_start = math_to_canvas(x_axis_start,cdim,ccen,mdim);
	var c_end = math_to_canvas(x_axis_end,cdim,ccen,mdim);

	ctx.beginPath();
	ctx.strokeStyle = "#FFFFFF";
	ctx.lineWidth = 1;
	ctx.moveTo(c_start.x,c_start.y);
	ctx.lineTo(c_end.x,c_end.y);
	ctx.stroke();

	//draw y_axis
	var y_axis_start = {x:0,y:num_unit_pos_h};
	var y_axis_end = {x:0,y:-num_unit_neg_h};

	c_start = math_to_canvas(y_axis_start,cdim,ccen,mdim);
	c_end = math_to_canvas(y_axis_end,cdim,ccen,mdim);

	ctx.beginPath();
	ctx.strokeStyle = "#FFFFFF";
	ctx.lineWidth = 1;
	ctx.moveTo(c_start.x,c_start.y);
	ctx.lineTo(c_end.x,c_end.y);
	ctx.stroke();
    
        for(var i = 1; i < num_unit_neg_h; i++){
            draw_helper_h(-i,cdim,ccen,mdim);
            draw_helper_line_h(-i,cdim,ccen,mdim);
        }
        for(var i = 1; i <= num_unit_pos_h; i++){
            draw_helper_h(i,cdim,ccen,mdim);
            draw_helper_line_h(i,cdim,ccen,mdim);
        }

        for(var i = 1; i < num_unit_neg_w; i++){
            draw_helper_v(-i,cdim,ccen,mdim);
            draw_helper_line_v(-i,cdim,ccen,mdim);
        }
        for(var i = 1; i <= num_unit_pos_w; i++){
            draw_helper_v(i,cdim,ccen,mdim);
            draw_helper_line_v(i,cdim,ccen,mdim);
        }
    }

    function draw_helper_line_h(y,cdim,ccen,mdim){
	var math_point = {x:0,y:y};
	var canvas_point = math_to_canvas(math_point,cdim,ccen,mdim);
	var ctx = get_canvas();

	ctx.beginPath();
	ctx.strokeStyle = "#EDEDED";
	ctx.lineWidth = 1;
	ctx.moveTo(canvas_point.x-5,canvas_point.y);
	ctx.lineTo(canvas_point.x+5,canvas_point.y);
	ctx.stroke();

	ctx.fillStyle = "#ffffff";
	ctx.font = "15px Arial";
	ctx.fillText(y,canvas_point.x+8, canvas_point.y);
    }

    function draw_helper_line_v(x,cdim,ccen,mdim){
        var math_point = {x:x,y:0};
        var canvas_point = math_to_canvas(math_point,cdim,ccen,mdim);
        var ctx = get_canvas();

        ctx.beginPath();
        ctx.strokeStyle = "#EDEDED";
        ctx.lineWidth = 1;
        ctx.moveTo(canvas_point.x,canvas_point.y-5);
        ctx.lineTo(canvas_point.x,canvas_point.y+5);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "15px Arial";
        ctx.fillText(x,canvas_point.x, canvas_point.y+16);
    }

    function draw_helper_v(x,cdim,ccen,mdim){
        var math_point = {x:x,y:0};
        var canvas_point = math_to_canvas(math_point,cdim,ccen,mdim);
        var ctx = get_canvas();

        ctx.beginPath();
        ctx.strokeStyle = "#BBBBBB";
        ctx.lineWidth = 0.3;
        ctx.moveTo(canvas_point.x,0);
        ctx.lineTo(canvas_point.x,cdim.h);
        ctx.stroke();
    }

    function draw_helper_h(y,cdim,ccen,mdim){
        var math_point = {x:0,y:y};
        var canvas_point = math_to_canvas(math_point,cdim,ccen,mdim);
        var ctx = get_canvas();

        ctx.beginPath();
        ctx.strokeStyle = "#BBBBBB";
        ctx.lineWidth = 0.3;
        ctx.moveTo(0,canvas_point.y);
        ctx.lineTo(cdim.w,canvas_point.y);
        ctx.stroke();
    }
    
    
    
</script>