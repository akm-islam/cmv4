import React, { Component } from 'react';
import Grid from '@mui/material/Grid';
import * as d3 from 'd3'
import { connect } from "react-redux";
class App extends Component {
    constructor(props) {
        super(props);
        this.state = { temp: 0 };
    }
    componentDidMount() {
    this.setState({temp:10})
    }
    componentDidUpdate() {
        var self=this
        var keywords=this.props.keywords_data[this.props.selected_topic_number].map(item=>item[0])
        var keyword_count={}
        for(var i=0;i<keywords.length;i++){keyword_count[keywords[i]]={"Expert":0,"Non Expert":0}}

        keywords.map(keyword=>{
            this.props.topic_data.map(item=>{
                if(item["cleaned_tweet"].split(" ").includes(keyword)){
                    //console.log(item)
                    if(item["label"]=="Expert"){
                        keyword_count[keyword]["Expert"]=keyword_count[keyword]["Expert"]+1
                    }
                    else{
                        keyword_count[keyword]["Non Expert"]=keyword_count[keyword]["Non Expert"]+1
                    }
                }
            })    
        })
        var data=Object.entries(keyword_count)
        var keyword_svg_width=(window.innerWidth-25)/10,keyword_svg_height=60
        var w=keyword_svg_width-5,h=25
        d3.select(".keyword_view_container").selectAll(".keyword_svg").data(data).join("svg").attr("class","keyword_svg").attr("width",w).attr("height",keyword_svg_height).attr("x",(d,i)=>keyword_svg_width*i)
        .attr("test",function(d){
            var expert_w = 0
            var non_expert_w = 0
            if(d[1]["Expert"]!=0){expert_w=(w/(d[1]["Expert"]+d[1]["Non Expert"]))*d[1]["Expert"]}
            if(d[1]["Non Expert"]!=0){non_expert_w=(w/(d[1]["Expert"]+d[1]["Non Expert"]))*d[1]["Non Expert"]}
            //console.log(w,expert_w,non_expert_w)
            //d3.select(this).selectAll(".border_rect").data([0]).join('rect').attr("class", "border_rect").attr("width", "100%").attr("height", h).style("stroke", "black").style("fill", "none").style("stroke-width", 1);
            d3.select(this).selectAll(".expert_rect").data([0]).join('rect').attr("class", "expert_rect").attr("height", h).style("fill", self.props.color["Expert"]).attr("width",expert_w)
            d3.select(this).selectAll(".non_expert_rect").data([0]).join('rect').attr("class", "non_expert_rect").attr("height", h).style("fill", self.props.color["Non Expert"]).attr("x",expert_w).attr("width",non_expert_w)
            d3.select(this).selectAll(".myText").data([0]).join("text").attr("class", "myText").attr("x", keyword_svg_width/2).attr('dominant-baseline',"middle").attr('text-anchor','middle')
            .attr("y",h+15).text(d[0]).attr("font-size",14).attr("fill","#1c1c1c")
        })
        //.on("click",()=>alert("clicked"))
    }
    render() {
        return (
            <Grid style={{ width: window.innerWidth,padding:"0px 10px"}}>
                <svg className="keyword_view_container" style={{width:"100%",height:60,marginTop:40}}></svg>
            </Grid>
        );
    }
}

const maptstateToprop = (state) => {
    return {
        original_data: state.original_data,
        selected_topic_number: state.selected_topic_number,
        keywords_data:state.keywords_data,
        topic_data:state.topic_data,
        color:state.color
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_original_data: (val) => dispatch({ type: "original_data", value: val }),
        Set_month_wise_data: (val) => dispatch({ type: "month_wise_data", value: val })
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(App);


//https://www.d3indepth.com/force-layout/
