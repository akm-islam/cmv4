import React, { Component } from 'react';
import Grid from '@mui/material/Grid';
import * as d3 from 'd3';
import * as $ from 'jquery'
import { connect } from "react-redux";
class App extends Component {
    constructor(props) {
        super(props);
        this.state = { temp: 0, selected_topic: "none" };
    }
    componentDidMount() {
        this.setState({ temp: 10 })
    }
    componentDidUpdate(prevProps, prevState) {
        var item_width = $(".topic_svg").width()
        var svg1_height = 20, item1_top_margin = 6
        var svg = d3.select("#" + this.props.myid)
        var svg1 = svg.selectAll(".svg1").data([0]).join('svg').attr("class", "svg1").attr("x", 0).attr("y", item1_top_margin).attr("width", item_width).attr("height", svg1_height+50)
        Createtopic_viz(this.props.d1, this.props.Topic_groupedData, svg1, item_width, svg1_height, this.props.color)
    }
    render() {
        return (
            <div className='topic_parent' style={{ width: this.props.topic_view_width, height: this.props.topic_view_height, backgroundColor: "rgb(237, 237, 237,0.6)", textAlign: "center", fontSize: 14, cursor: "pointer", opacity: this.props.topic == this.props.selected_topic || this.props.selected_topic == "none" ? 1 : 0.5 }}
                onClick={() => {
                    this.props.Set_selected_topic(this.props.topic)
                    var topic_data = this.props.original_data.filter(item => item['topic_name'] == this.props.topic)
                    this.props.Set_selected_topic_number(topic_data[0]['topic_number'])
                    this.props.Set_topic_data(topic_data)
                }}>
                <div className='topic_text' style={{ height: 35, paddingTop: 5 }}>{this.props.topic}</div>
                <svg className='topic_svg' id={this.props.myid} style={{ width: "100%", height: $(".topic_parent").height() - $(".topic_text").height() }}> </svg>
            </div>
        );
    }
}

const maptstateToprop = (state) => {
    return {
        original_data: state.original_data,
        selected_topic: state.selected_topic,
        color: state.color
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_selected_topic_number: (val) => dispatch({ type: "selected_topic_number", value: val }),
        Set_selected_topic: (val) => dispatch({ type: "selected_topic", value: val }),
        Set_topic_data: (val) => dispatch({ type: "topic_data", value: val }),
    }
}
function Createtopic_viz(d1, groupedData, svg, item_width, item1_height, color) {
    var temp_ratio_svg_width = item_width / 3
    var topic_scale = d3.scaleLinear().domain([0, d3.max(groupedData.map(item => item.values.length))]).range([0, temp_ratio_svg_width])
    //------------------------ svg ratio view
    var groupedData2 = d3.nest().key((d) => d['label']).entries(d1.values)
    var ratio_svg_x_postion = 2
    // the width is defined svg is defined at the top
    var ratio_svg_width = topic_scale(d1.values.length)
    svg.selectAll(".ratio_svg").data([0]).join("svg").attr("x", ratio_svg_x_postion).attr("class", "ratio_svg").attr("width", ratio_svg_width).attr("height", item1_height).attr('y', 0).attr("add_rect", function (d, i) {
        if (groupedData2.length > 1) {
            var total = groupedData2[0].values.length + groupedData2[1].values.length
            if (groupedData2[0].key == "Expert") { var expert_width = (groupedData2[0].values.length / total) * ratio_svg_width }
            else { var expert_width = (groupedData2[1].values.length / total) * ratio_svg_width }
            var non_expert_width = ratio_svg_width - expert_width
            d3.select(this).selectAll(".my_rect1").data(["Expert"]).join('rect').attr("class", "my_rect1").attr("x", 0).attr("width", expert_width).attr("height", "100%").style("fill", d => color[d])
            d3.select(this).selectAll(".my_rect2").data(["Non Expert"]).join('rect').attr("class", "my_rect2").attr("x", expert_width).attr("width", non_expert_width).attr("height", "100%").style("fill", d => color[d])
        }
        else { d3.select(this).selectAll(".my_rect3").data(groupedData2).join('rect').attr("class", "my_rect3").attr("x", 0).attr("width", "100%").attr("height", "100%").style("fill", d => color[d.key]) }
    })
    //-------------------------- Create Histogram Subjectivity
    var histogram_sub_svg_x_position = temp_ratio_svg_width + ratio_svg_x_postion + 5, histogram_svg_width = item_width / 3
    
    // Histogram label
    svg.selectAll(".histogram_sub_text").data([0]).join("text")
    .attr("x", histogram_sub_svg_x_position+histogram_svg_width/2).attr("y", item1_height+10).attr("class", "histogram_sub_text")
    .attr('text-anchor','middle').attr('dominant-baseline', "middle").text('subjectivity').attr("font-size",10)
    
    svg.selectAll(".histogram_svg_subjectivity").data([0]).join("svg").attr("x", histogram_sub_svg_x_position).attr("class", "histogram_svg_subjectivity").attr("width", histogram_svg_width).attr("height", item1_height).attr('y', 0)
        .attr("add_histogram", function () {
            var average = d3.sum(d1.values.map(item => item['subjective_prob'])) / d1.values.length
            //console.log(average)
            var expert_data = d1.values.filter(item => item['label'] == 'Expert')
            var expert_average = d3.sum(expert_data.map(item => item['subjective_prob'])) / expert_data.length
            var non_expert_data = d1.values.filter(item => item['label'] == 'Non Expert')
            var non_expert_average = d3.sum(non_expert_data.map(item => item['subjective_prob'])) / non_expert_data.length
            // Bins of subjectivity score
            var histogram = d3.histogram().value(d => d['subjective_prob']).thresholds(25)
            var non_expert_bins = histogram(non_expert_data).map(item => { return { "count": item.length, "x0": item.x0, "x1": item.x1 } })
            var expert_bins = histogram(expert_data).map(item => { return { "count": item.length, "x0": item.x0, "x1": item.x1 } })
            var x = d3.scaleLinear().domain([0, 1]).range([0, histogram_svg_width])
            var y = d3.scaleLinear().domain([0, d3.max([...expert_bins, ...non_expert_bins].map(item => item['count']))]).range([item1_height, 0])
            //console.log(d3.max([...non_expert_bins].map(item=>item['count'])))
            d3.select(this).selectAll(".non_expert_sub_path").data([0]).join("path").attr("class", "non_expert_sub_path").attr("fill", color['Non Expert']).attr("stroke", "rgb(190,190,190)")
                .attr("d", d => d3.area().x(d => x(d["x0"])).y0(y(0)).y1(d => y(d['count'])).curve(d3.curveMonotoneX)(non_expert_bins)).attr('opacity', 1)

            d3.select(this).selectAll(".expert_sub_path").data([0]).join("path").attr("class", "expert_sub_path").attr("fill", color['Expert']).attr("stroke", "rgb(190,190,190)")
                .attr("d", d => d3.area().x(d => x(d["x0"])).y0(y(0)).y1(d => y(d['count'])).curve(d3.curveMonotoneX)(expert_bins)).attr('opacity', 0.5).attr("data", JSON.stringify(expert_bins))
            d3.select(this).selectAll(".average_line").data([average]).join("line").attr("class", "average_line").attr("x1", d => x(d)).attr("x2", d => x(d)).attr("y1", 0).attr("y2", item1_height).attr("stroke-width", 1)
                .attr("stroke", "gray").attr("avg", d => d)
        })
    //-------------------------- Create Histogram Subjectivity ends

    //-------------------------- Create Histogram Sentiment
    var histogram_sent_svg_x_position = histogram_sub_svg_x_position + histogram_svg_width + 5, histogram_sent_svg_width = histogram_svg_width
    // Histogram label
    svg.selectAll(".histogram_sent_text").data([0]).join("text")
    .attr("x", histogram_sent_svg_x_position+histogram_sent_svg_width/2).attr("y", item1_height+10).attr("class", "histogram_sent_text")
    .attr('text-anchor','middle').attr('dominant-baseline', "middle").text('sentiment').attr("font-size",10)
    
    svg.selectAll(".histogram_svg_sentiment").data([0]).join("svg").attr("x", histogram_sent_svg_x_position).attr("class", "histogram_svg_sentiment").attr("width", histogram_svg_width).attr("height", item1_height).attr('y', 0)
        .attr("add_histogram", function () {
            var average = d3.sum(d1.values.map(item => item['SentimentScore'])) / d1.values.length
            var expert_data = d1.values.filter(item => item['label'] == 'Expert')
            var expert_average = d3.sum(expert_data.map(item => item['SentimentScore'])) / expert_data.length
            var non_expert_data = d1.values.filter(item => item['label'] == 'Non Expert')
            var non_expert_average = d3.sum(non_expert_data.map(item => item['SentimentScore'])) / non_expert_data.length
            // Bins of subjectivity score
            var histogram = d3.histogram().value(d => d['SentimentScore']).thresholds(25)
            var non_expert_bins = histogram(non_expert_data).map(item => { return { "count": item.length, "x0": item.x0, "x1": item.x1 } })
            var expert_bins = histogram(expert_data).map(item => { return { "count": item.length, "x0": item.x0, "x1": item.x1 } })
            var x = d3.scaleLinear().domain([-100, 100]).range([0, histogram_sent_svg_width])
            var y = d3.scaleLinear().domain([0, d3.max([...expert_bins, ...non_expert_bins].map(item => item['count']))]).range([item1_height, 0])

            d3.select(this).selectAll(".expert_sub_path").data([0]).join("path").attr("class", "expert_sub_path").attr("fill", color['Expert']).attr("stroke", "rgb(190,190,190)")
                .attr("d", d => d3.area().x(d => x(d["x0"])).y0(y(0)).y1(d => y(d['count'])).curve(d3.curveMonotoneX)(expert_bins)).attr('opacity', 0.5).attr("data", JSON.stringify(expert_bins))

            d3.select(this).selectAll(".non_expert_sub_path").data([0]).join("path").attr("class", "non_expert_sub_path").attr("fill", color['Non Expert']).attr("stroke", "rgb(190,190,190)")
                .attr("d", d => d3.area().x(d => x(d["x0"])).y0(y(0)).y1(d => y(d['count'])).curve(d3.curveMonotoneX)(non_expert_bins)).attr('opacity', 1)

            d3.select(this).selectAll(".average_line").data([average]).join("line").attr("class", "average_line").attr("x1", d => x(d)).attr("x2", d => x(d)).attr("y1", 0).attr("y2", item1_height).attr("stroke-width", 1)
                .attr("stroke", "gray").attr("avg", d => d)

        })
    //-------------------------- Create Histogram Sentiment ends
}
export default connect(maptstateToprop, mapdispatchToprop)(App);


//https://www.d3indepth.com/force-layout/
