import React, { Component } from 'react';
import Grid from '@mui/material/Grid';
import * as d3 from 'd3';
import { connect } from "react-redux";
import * as algo from "./algo"
class App extends Component {
    constructor(props) {
        super(props);
        this.state = { temp: 0 };
    }
    componentDidMount() {
        this.setState({ temp: 10 })
    }
    componentDidUpdate() {
        var self = this
        var cell_height = 15, cell_width = 147
        var cell_gap_x = 3, cell_gap_y = 3
        var sent_scale = d3.scaleLinear().domain([-100, 0, 100]).range([cell_width / 2 - cell_gap_x, 0, cell_width / 2 - cell_gap_x])
        var sub_scale = d3.scaleLinear().domain([0, 1]).range([0, cell_width - cell_gap_x])
        var keywords = this.props.keywords_data[this.props.selected_topic_number].map(item => item[0])
        var stroke_color = "black", cell_color = "#939393", stroke_width = 0.06
        
        //---------- Get Keyword Frequency
        var keywords=this.props.keywords_data[this.props.selected_topic_number].map(item=>item[0]).filter(item=>!self.props.removed_keywords.includes(item))
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
        //-------
        console.log(algo.get_data_combination(this.props.topic_data))
        var my_data = algo.get_data_combination(this.props.topic_data)
        //.sort((a, b) => b["SentimentScore"] - a["SentimentScore"])

        console.log(my_data,"topic_data")
        d3.select(".matrix_view_container").attr("width", cell_width * 12).selectAll(".item").data(my_data).join("g").attr("class", "item").attr("transform", (d, i) => "translate(0," + (30 + i * cell_height) + ")").attr("group",d=>d['group'])
            .attr("add_sentimentscore", function (d, i) {
                if (i == 0) { d3.select(this).selectAll(".sentText").data([0]).join("text").attr("x", cell_width / 2).attr('text-anchor', 'middle').attr("class", "sentText").attr('dominant-baseline', "middle").attr("y", -15).text('Sentiment').attr("fill", "#1c1c1c").attr("font-size", 14) }
                d3.select(this).selectAll(".sentimentscore_border_rect").data([0]).join('rect').attr("class", "sentimentscore_border_rect").attr("width", cell_width - cell_gap_x).attr("height", cell_height - cell_gap_y).style("stroke", stroke_color).style("fill", "none").style("stroke-width", stroke_width)
                d3.select(this).selectAll(".sentimentscore_rect").data([0]).join('rect').attr("class", "sentimentscore_rect").attr("width", sent_scale(parseFloat(d["SentimentScore"]))).attr("height", cell_height - cell_gap_y).style("fill", cell_color).attr("x", () => {
                    if (parseFloat(d["SentimentScore"]) > 0) { return cell_width / 2 }
                    else { return (cell_width / 2) - sent_scale(parseFloat(d["SentimentScore"])) }
                })
                    .attr("sentiment_score", () => d["SentimentScore"])
            })
            .attr("add_subjectivityscore", function (d, i) {
                if (i == 0) { d3.select(this).selectAll(".subText").data([0]).join("text").attr("x", cell_width + cell_width / 2).attr('text-anchor', 'middle').attr("class", "subText").attr('dominant-baseline', "middle").attr("y", -15).text('Subjectivity').attr("fill", "#1c1c1c").attr("font-size", 14) }

                d3.select(this).selectAll(".subjectivityscore_border_rect").data([0]).join('rect').attr("class", "subjectivityscore_border_rect").attr("width", cell_width - cell_gap_x).attr("height", cell_height - cell_gap_y).style("stroke", stroke_color).style("fill", "none").style("stroke-width", stroke_width).attr("x", cell_width)
                d3.select(this).selectAll(".subjectivityscore_rect").data([0]).join('rect').attr("class", "subjectivityscore_rect").attr("width", sub_scale(parseFloat(d["subjective_prob"]))).attr("height", cell_height - cell_gap_y).style("fill", cell_color).attr("x", cell_width)
            })
            .attr("add_keywords", function (d, i) {
                var cell_color = self.props.color[d['label']]
                if (i == 0) {
                    var rect_w=10,rect_h=14
                    var just_count=[...Object.values(keyword_count).map(item=>item['Expert']),...Object.values(keyword_count).map(item=>item['Non Expert'])]
                    var y_scale=d3.scaleLinear().domain(d3.extent(just_count)).range([1,rect_h])
                    d3.select(this).selectAll(".mysvg").data(keywords).join("svg").attr('class','mysvg').attr("x", (d, i) => (cell_width * 2) + (cell_width * i)).attr("y",-25).attr("width", cell_width).attr("height", 20)
                    .attr("add_text",function(keyword){
                        d3.select(this).selectAll(".keyword_Text").data([keyword]).join("text").attr("x", 5).attr("y", 10).attr("class", "keyword_Text").attr('dominant-baseline', "middle").attr("fill", "#1c1c1c").style("text-transform", "capitalize").attr("font-size", 14).text(keyword)
                    })
                    .attr("add_bars",function(keyword){
                        var x_pos=d3.select(this).select(".keyword_Text").node().getBBox()['width']+10
                        d3.select(this).selectAll(".bar1").data([0]).join('rect').attr('x',x_pos).attr('y',rect_h - y_scale(keyword_count[keyword]['Expert'])).attr("class", "bar1").attr("width", rect_w).attr("height", y_scale(keyword_count[keyword]['Expert'])).style("fill", self.props.color['Expert'])
                        d3.select(this).selectAll(".bar2").data([0]).join('rect').attr('x',x_pos+rect_w+2).attr('y',rect_h - y_scale(keyword_count[keyword]['Non Expert'])).attr("class", "bar2").attr("width", rect_w).attr("height", y_scale(keyword_count[keyword]['Non Expert'])).style("fill", self.props.color["Non Expert"])
                        
                        d3.select(this).selectAll(".c_button").data([0]).join("text").attr("class","fa c_button").attr('x',cell_width-20).attr('y',14).text("\uf410").attr('font-size',13).attr('cursor','pointer')
                        .on('click',()=>self.props.Set_removed_keywords([keyword,...self.props.removed_keywords]))
                    })
                }
                d3.select(this).selectAll(".keywords_border_rect").data(keywords).join('rect').attr("class", "keywords_border_rect").attr("width", cell_width - cell_gap_x).attr("height", cell_height - cell_gap_y).style("stroke", stroke_color).attr("x", (d, i) => (cell_width * 2) + (cell_width * i)).style("stroke-width", stroke_width)
                    .style("fill", keyword => d["cleaned_tweet"].split(" ").includes(keyword) ? cell_color : "white").on('contextmenu',a=>{
                        var data_by_group=my_data.filter(item=>item['group']==d['group'])
                        self.props.Set_selected_group_data(data_by_group)
                    })
            })
    }
    render() {
        return (
            <Grid>
                {this.props.topic_data != null ? <svg className="matrix_view_container" style={{ height: (this.props.topic_data.length * 15) + 30, padding: 10 }}></svg> : null}
            </Grid>
        );
    }
}

const maptstateToprop = (state) => {
    return {
        topic_data: state.topic_data,
        selected_topic_number: state.selected_topic_number,
        keywords_data: state.keywords_data,
        color: state.color,
        removed_keywords:state.removed_keywords
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_month_wise_data: (val) => dispatch({ type: "month_wise_data", value: val }),
        Set_removed_keywords: (val) => dispatch({ type: "removed_keywords", value: val }),
        Set_selected_group_data: (val) => dispatch({ type: "selected_group_data", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(App);


//https://www.d3indepth.com/force-layout/
