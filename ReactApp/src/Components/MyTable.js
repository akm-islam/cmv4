import React, { Component } from 'react';
import Popover from '@mui/material/Popover';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { connect } from "react-redux";
class BasicTable extends Component {
    constructor(props) {
        super(props);
        this.state = { temp: 0};
    }
    componentDidMount() {
      this.setState({selected_group_data:this.props.selected_group_data})
      this.setState({temp:1})
    }
    componentDidUpdate() {
      
        }
    render() {
        return (
          <div>
          { this.props.selected_group_data!=null?<Popover id={"id"} open={this.props.table_open} onClose={() => this.props.Set_table_open(false)}>
          <Grid container direction="row" justifyContent="space-around" >
            <Grid item xs={9} sx={{ paddingLeft: 0, marginLeft: -3 }}><p style={{ margin: 0, padding: 0, fontSize: 20, fontWeight: 600 }}>Tweets</p></Grid>
            <Grid item>
              <a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.props.selected_group_data))}`}
                download={this.props.selected_month + "_" + this.props.selected_group + ".json"}
              >
                {`Export Data`}
              </a>
            </Grid>
          </Grid>
          <Grid>
          {this.props.selected_group_data.map(row =><Grid container direction="row" style={{border:"1px solid #cccccc",padding:"0px 10px"}}>
            <grid item xs={6} style={{width:"80%",marginBottom:10}}>{row.raw_tweet}</grid>
            <grid item xs={4} style={{marginLeft:10}}><TextField id="standard-basic" label="" variant="standard" onChange={(event)=>{
              var temp=this.props.selected_group_data.map(item=>{
                if(item.raw_tweet==row.raw_tweet){
                  item['tweet_label']=event.target.value
                }
                return item
              })
              this.props.Set_selected_group_data(temp)
            }}/></grid>
          </Grid>)}</Grid>
        </Popover>:null}</div>
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
        Set_selected_group_data: (val) => dispatch({ type: "selected_group_data", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(BasicTable);


//https://www.d3indepth.com/force-layout/

