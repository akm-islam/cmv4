import React, { Component } from 'react';
import Grid from '@mui/material/Grid';
import * as d3 from 'd3';
import { connect } from "react-redux";
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
        var cell_height = 15, rect_width = (window.innerWidth - 40) / 12
        var cell_gap_x = 3, cell_gap_y = 3
        var sent_scale = d3.scaleLinear().domain([-100, 0, 100]).range([rect_width / 2 - cell_gap_x, 0, rect_width / 2 - cell_gap_x])
        var sub_scale = d3.scaleLinear().domain([0, 1]).range([0, rect_width - cell_gap_x])
        var keywords = this.props.keywords_data[this.props.selected_topic_number].map(item => item[0])
        var stroke_color = "black", cell_color = "#939393", stroke_width = 0.06
        
        //---------- Get Keyword Frequency
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
        //-------
        var my_data = this.props.topic_data.sort((a, b) => b["SentimentScore"] - a["SentimentScore"])
        d3.select(".matrix_view_container").attr("width", rect_width * 12).selectAll(".item").data(my_data).join("g").attr("class", "item").attr("transform", (d, i) => "translate(0," + (30 + i * cell_height) + ")")
            .attr("add_sentimentscore", function (d, i) {
                if (i == 0) { d3.select(this).selectAll(".sentText").data([0]).join("text").attr("x", rect_width / 2).attr('text-anchor', 'middle').attr("class", "sentText").attr('dominant-baseline', "middle").attr("y", -15).text('Sentiment').attr("fill", "#1c1c1c").attr("font-size", 14) }
                d3.select(this).selectAll(".sentimentscore_border_rect").data([0]).join('rect').attr("class", "sentimentscore_border_rect").attr("width", rect_width - cell_gap_x).attr("height", cell_height - cell_gap_y).style("stroke", stroke_color).style("fill", "none").style("stroke-width", stroke_width)
                d3.select(this).selectAll(".sentimentscore_rect").data([0]).join('rect').attr("class", "sentimentscore_rect").attr("width", sent_scale(parseFloat(d["SentimentScore"]))).attr("height", cell_height - cell_gap_y).style("fill", cell_color).attr("x", () => {
                    if (parseFloat(d["SentimentScore"]) > 0) { return rect_width / 2 }
                    else { return (rect_width / 2) - sent_scale(parseFloat(d["SentimentScore"])) }
                })
                    .attr("sentiment_score", () => d["SentimentScore"])
            })
            .attr("add_subjectivityscore", function (d, i) {
                if (i == 0) { d3.select(this).selectAll(".subText").data([0]).join("text").attr("x", rect_width + rect_width / 2).attr('text-anchor', 'middle').attr("class", "subText").attr('dominant-baseline', "middle").attr("y", -15).text('Subjectivity').attr("fill", "#1c1c1c").attr("font-size", 14) }

                d3.select(this).selectAll(".subjectivityscore_border_rect").data([0]).join('rect').attr("class", "subjectivityscore_border_rect").attr("width", rect_width - cell_gap_x).attr("height", cell_height - cell_gap_y).style("stroke", stroke_color).style("fill", "none").style("stroke-width", stroke_width).attr("x", rect_width)
                d3.select(this).selectAll(".subjectivityscore_rect").data([0]).join('rect').attr("class", "subjectivityscore_rect").attr("width", sub_scale(parseFloat(d["subjective_prob"]))).attr("height", cell_height - cell_gap_y).style("fill", cell_color).attr("x", rect_width)
            })
            .attr("add_keywords", function (d, i) {
                var cell_color = self.props.color[d['label']]
                if (i == 0) {
                    d3.select(this).selectAll(".mysvg").data(keywords).join("svg").attr("x", (d, i) => (rect_width * 2) + (rect_width * i)).attr("y",-20).attr("width", rect_width).attr("height", 20)
                    .attr("add_text",function(keyword){
                        d3.select(this).selectAll(".keyword_Text").data([keyword]).join("text").attr("x", 5).attr("y", 10).attr("class", "keyword_Text").attr('dominant-baseline', "middle").attr("fill", "#1c1c1c").style("text-transform", "capitalize").attr("font-size", 14).text(d)
                    })
                    .attr("add_bars",function(keyword){
                        console.log(keyword_count[keyword])
                        //d3.select(this).selectAll(".bar1").data([d]).join("text").attr("x", 5).attr("y", 10).attr("class", "keyword_Text").attr('dominant-baseline', "middle").attr("fill", "#1c1c1c").style("text-transform", "capitalize").attr("font-size", 14).text(d)
                    })
                    
                    
                }
                d3.select(this).selectAll(".keywords_border_rect").data(keywords).join('rect').attr("class", "keywords_border_rect").attr("width", rect_width - cell_gap_x).attr("height", cell_height - cell_gap_y).style("stroke", stroke_color).attr("x", (d, i) => (rect_width * 2) + (rect_width * i)).style("stroke-width", stroke_width)
                    .style("fill", keyword => d["cleaned_tweet"].split(" ").includes(keyword) ? cell_color : "none")

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
        color: state.color
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_month_wise_data: (val) => dispatch({ type: "month_wise_data", value: val })
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(App);


//https://www.d3indepth.com/force-layout/
