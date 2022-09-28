import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import { Radio } from '@mui/material';
import * as d3 from 'd3';
import March from "../Data/csv/March.csv";
import April from "../Data/csv/April.csv";
import MarchKeywords from "../Data/02keywords/March.json";
import AprilKeywords from "../Data/02keywords/April.json";

export default function FormControlLabelPosition(props) {
    const [selected_months, set_selected_months] = React.useState('March');
    const months_option = ['March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return (
        <Grid container direction="row" justifyContent="center" alignItems="center" style={{height:55,backgroundColor:"rgb(237, 237, 237,0.6)"}}>
            <p style={{marginRight:20,fontSize:18,fontWeight:600}}>Select Month:</p>
            <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                    {months_option.map(item => <FormControlLabel value="start" control={<Radio sx={{ padding: "2px",'&, &.Mui-checked': {color: '#828282'} }} checked={selected_months==item?true:false} onClick={()=>{
                        set_selected_months(item)
                        var filename=March
                        if(item=="March"){
                            filename=March
                            props.Set_keywords_data(MarchKeywords)
                        }
                        else if(item=="April"){
                            filename=April
                            props.Set_keywords_data(AprilKeywords)
                        }
                        d3.csv(filename).then(original_data => {
                            props.Set_original_data(original_data)
                            console.log(original_data)
                        })
                        props.set_selcted_month(item)
                    }}/>} label={item} labelPlacement="end" />)}
                </FormGroup>
            </FormControl>
        </Grid>
    );
}
