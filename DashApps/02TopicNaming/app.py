from numpy import sort
import pandas as pd
import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
from dash import dash_table
import json
app = dash.Dash(__name__)
df=pd.read_csv("./01RawData/May.csv")
app.layout = html.Div(
    children=[
        dcc.Store(id='topics', storage_type='local'),
        html.Div(id="parent1",children=[
            dcc.Dropdown(id='months_dropdown', multi=False, options=[{'label': x, 'value': x} for x in ["March", "April", "May"]], value="April",style={"width":"200px"}),
            dcc.Dropdown(id='topics_dropdown', multi=False, options=[], value=[],style={"width":"200px"}),
            dcc.Input(id="objectivity_threshold", type='number', placeholder="objectivity_threshold",step="0.1",value=0.2),
            dcc.Input(id="subjectivity_threshold", type='number', placeholder="subjectivity_threshold",step="0.1",value=0.8),
            dcc.RadioItems(id="keyword_radio",options=['New York City', 'Montreal','San Francisco'], value='Montreal', inline=True)
            ]),
        dash_table.DataTable(id='data_table',data=[], columns=[{"name": i, "id": i} for i in ["raw_tweet","label","subjective_prob","objective_prob"]],page_size=12,style_data={'whiteSpace': 'normal','height': 'auto'},style_cell={'textAlign': 'left'})
    ]
)

#----------------------- Set topics dropdown starts here
@app.callback([Output('topics_dropdown','options'),Output('topics_dropdown','value')],[Input(component_id='months_dropdown', component_property='value')],prevent_initial_call=False)
def update_my_graph(val_chosen):
    selected_month=val_chosen
    df=pd.read_csv("./01RawData/"+selected_month+".csv")
    topic_list=sort(df['topic_number'].unique())[1:]
    return [{'label': x, 'value': x} for x in list(topic_list)],topic_list[0]

#----------------------- Set radio options
@app.callback([Output('keyword_radio','options'),Output('keyword_radio','value')],[Input(component_id='months_dropdown', component_property='value'),Input(component_id='topics_dropdown', component_property='value')],prevent_initial_call=True)
def update_my_graph(selected_month,selected_topic_number):
    f = open("./02keywords/"+selected_month+'.json')    
    keywords_data = json.load(f)
    keywords=[i[0] for i in keywords_data[str(selected_topic_number)]]
    keywords.append("None")
    f.close()
    return keywords,"None"

#----------------------- Set data for data table dropdown starts here
@app.callback(Output('data_table','data'),[Input(component_id='months_dropdown', component_property='value'),Input(component_id='topics_dropdown', component_property='value'),
Input(component_id='objectivity_threshold', component_property='value'),Input(component_id='subjectivity_threshold', component_property='value'),Input(component_id='keyword_radio', component_property='value')],prevent_initial_call=True)
def update_my_graph(selected_month,selected_topic_number,objectivity_threshold,subjectivity_threshold,keyword_radio_value):
    df=pd.read_csv("./01RawData/"+selected_month+".csv")
    if(keyword_radio_value!="None"):
        df=df[df["raw_tweet"].str.contains(keyword_radio_value)]
        print(keyword_radio_value)
    # Subjective
    if(objectivity_threshold!=0):
        df2=df[(df['topic_number']==selected_topic_number) & (df['subjective_prob']<=objectivity_threshold)].sort_values(by=['subjective_prob'])
    # Objective
    else:
        df2=df[(df['topic_number']==selected_topic_number) & (df['subjective_prob']>=subjectivity_threshold)].sort_values(by=['objective_prob'])
    return df2.to_dict('records')

if __name__ == '__main__':
    app.run_server(debug=True,host="0.0.0.0", port="8050")
