import React, { Component } from 'react';
import Grid from '@mui/material/Grid';
import * as d3 from 'd3';
import * as $ from 'jquery'
import { connect } from "react-redux";
class App extends Component {
    constructor(props) {
        super(props);
        this.state = { temp: 0 };
    }
    componentDidMount() {
    }
    componentDidUpdate() {

    }
    render() {
        return (
            <Grid container direction="column" justifyContent="center" alignItems="center" style={{ width: window.innerWidth }}>
                Hello
            </Grid>
        );
    }
}

const maptstateToprop = (state) => {
    return {
        original_data: state.original_data,
        month_wise_data: state.month_wise_data,
        default_month: state.default_month,
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
