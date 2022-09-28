from decimal import Overflow
from gc import callbacks
from numpy import sort
import pandas as pd
import plotly.express as px
import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output, State
app = dash.Dash(__name__)
app.layout = html.Div(
    children=[
        dcc.Store(id='topics', storage_type='local'),
        dcc.Store(id='word_freq', storage_type='local'),
        dcc.Store('selected_words', 'local'),
        html.Div(id="parent1", children=[
            dcc.Dropdown(id='months_dropdown', multi=False, options=[{'label': x, 'value': x} for x in [
                         "March", "April", "May","June","July","August","September"]], value="September", style={"width": "200px"}),
            dcc.Input(id="threshold_lower", type='number',placeholder="objectivity_threshold", step=1, value=2),
            dcc.Input(id="threshold_upper", type='number',placeholder="objectivity_threshold", step=1, value=10000),
        ]),
        html.Div(id="checklist_container_div", children=[dcc.Checklist(id="mychecklist_id", options=[], value=[], inline=True)], style={"height": "600px", "overflow": "scroll"}),
        html.Button('Clean', id='button1', n_clicks=0,style={"margin-left":"45%"}),
        html.Div(id='hidden-div', style={'display':'none'})
    ]
)

# ----------------------- Set data for data table dropdown starts here
@app.callback(Output('mychecklist_id', 'options'), [Input(component_id='months_dropdown', component_property='value'), Input(component_id='threshold_lower', component_property='value'),Input(component_id='threshold_upper', component_property='value')], prevent_initial_call=False)
def update_my_graph(selected_month, threshold_lower,threshold_upper):
    word_size=20
    df = pd.read_csv("./data/"+selected_month+".csv")
    mydict = {}
    for index, row in df.iterrows():
        temp1 = str(row['cleaned_tweet']).split()
        for word in temp1:
            if word not in mydict:
                mydict[word] = 1
            else:
                mydict[word] += 1
    sorted_dict = {k: v for k, v in sorted(
        mydict.items(), key=lambda item: -item[1])}
    sorted_list = list(sorted_dict.items())
    filtered_list = [t[0] for t in sorted_list if (t[1] >= threshold_lower and t[1] <= threshold_upper)]
    filtered_list2 = [word for word in filtered_list if len(word)<word_size]
    print("max occurence: ",sorted_list[0][1])
    print("Number of words: ",len(filtered_list))
    return filtered_list2


@app.callback(Output('selected_words', 'data'), Input('mychecklist_id', 'value'))
def handle_checkbox_change(selected_words):
    #print(selected_words)
    return selected_words

@app.callback(Output('hidden-div','children'),[Input('button1','n_clicks'),Input(component_id='months_dropdown', component_property='value')],[State('selected_words', 'data')],prevent_initial_call=True)
def handle_click(n_clciks,selected_month,selected_words):
    df = pd.read_csv("./data/"+selected_month+".csv")
    df['cleaned_tweet']=df['cleaned_tweet'].apply(lambda x: ' '.join([word for word in str(x).split() if word not in selected_words]))
    print(df.shape)
    df2=df[df['cleaned_tweet'].apply(lambda x:len(x.split())>5)]
    df2.to_csv("./data/"+selected_month+".csv",index=None)
    print(n_clciks,selected_words)
    print(df2.shape)

if __name__ == '__main__':
    app.run_server(debug=True, host="0.0.0.0", port="8050")
