import React, { Component } from 'react';
import Grid from '@mui/material/Grid';
import * as d3 from 'd3';
import { connect } from "react-redux";
import March from "./Data/csv/March.csv";
import MarchKeywords from "./Data/02keywords/March.json";
import MonthsRadio from "./Components/MonthsRadio"
import TopicView from './Components/TopicView';
import MatrixView from './Components/MatrixView';
import MyTable from './Components/MyTable'

import "./App.css"
class App extends Component {
    constructor(props) {
        super(props);
        this.state = { temp: 0 };
    }
    componentDidMount() {
        // Set the defaults
        d3.csv(March).then(original_data => this.props.Set_original_data(original_data))
        this.props.Set_keywords_data(MarchKeywords)
    }
    componentDidUpdate() {
        if (this.props.original_data != null) {
            var topic_data = this.props.original_data.filter(item => item['topic_name'] == this.props.selected_topic)
            //this.props.Set_selected_topic_number(topic_data[0]['topic_number'])
            this.props.Set_topic_data(topic_data)
        }
    }
    render() {
        var Topic_groupedData = d3.nest().key((d) => d['topic_name']).entries(this.props.original_data).sort((a, b) => b['values'].length - a['values'].length)
        var select_month_height = 56
        var topic_view_container_width = window.innerWidth,topic_view_container_height=100+20 // topic_view_container_height is controls the height of each topic card
        var keywords_view_height=0
        var topic_view_width = 263, topic_view_height = topic_view_container_height-20, topicview_margin_right = 8
        return (
            <Grid container direction="row" justifyContent="center" alignItems="center" style={{ width: window.innerWidth }}>
                <Grid style={{ height: select_month_height, width: "100%" }}>
                    <MonthsRadio default_month={this.props.default_month} Set_original_data={this.props.Set_original_data} Set_keywords_data={this.props.Set_keywords_data} Set_selected_month={this.props.Set_selected_month}></MonthsRadio>
                </Grid>
                <Grid className='topic_view_container' style={{ marginTop: 0, overflow: "scroll", height: topic_view_container_height, width: topic_view_container_width, padding: 0 }}>
                    <div className="scrolable_topic" style={{ width: Topic_groupedData.length * (topic_view_width + topicview_margin_right), height: 160 }}>
                        {Topic_groupedData.map((item, i) => <div item style={{ height: 150, marginTop: 5, marginRight: topicview_margin_right, display: "inline-block" }}><TopicView topic_view_width={topic_view_width} topic_view_height={topic_view_height} topic={item.key} myid={"topic" + i} Topic_groupedData={Topic_groupedData} d1={item}> </TopicView></div>)}
                    </div>
                </Grid>
                {this.props.keywords_data != null ? <Grid item style={{ width:window.innerWidth, height: window.innerHeight-(select_month_height+topic_view_container_height+keywords_view_height+20), border: "3px solid rgb(163, 163, 163,0.5)",margin:10,overflow:"scroll"}}><MatrixView></MatrixView></Grid> : null}
            {this.props.selected_group.length>0?<MyTable selected_group={this.props.selected_group} selected_month={this.props.selected_month} selected_group_data={this.props.selected_group_data} table_open={this.props.table_open} Set_table_open={this.props.Set_table_open}></MyTable>:null}
            </Grid>
        );
    }
}

const maptstateToprop = (state) => {
    return {
        original_data: state.original_data,
        default_month: state.default_month,
        keywords_data: state.keywords_data,
        selected_topic: state.selected_topic,
        selected_group_data:state.selected_group_data,
        table_open:state.table_open,
        selected_month:state.selected_month,
        selected_group:state.selected_group

    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_original_data: (val) => dispatch({ type: "original_data", value: val }),
        Set_keywords_data: (val) => dispatch({ type: "keywords_data", value: val }),
        Set_selected_topic_number: (val) => dispatch({ type: "selected_topic_number", value: val }),
        Set_selected_topic: (val) => dispatch({ type: "selected_topic", value: val }),
        Set_topic_data: (val) => dispatch({ type: "topic_data", value: val }),
        Set_table_open: (val) => dispatch({ type: "table_open", value: val }),
        Set_table_open: (val) => dispatch({ type: "table_open", value: val }),
        Set_selected_month: (val) => dispatch({ type: "selected_month", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(App);


//https://www.d3indepth.com/force-layout/
