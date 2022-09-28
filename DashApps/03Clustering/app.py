import pandas as pd
import plotly.express as px
import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output,ALL
from sklearn.manifold import TSNE
import numpy as np
import json
from dash import dash_table
from pyclustering.cluster.center_initializer import kmeans_plusplus_initializer
from pyclustering.cluster.kmeans import kmeans
from pyclustering.utils.metric import type_metric, distance_metric
from scipy.spatial import distance
import numpy as np
from sklearn.manifold import MDS

app = dash.Dash(__name__)
march_topic_names={-1: 'Other',
 0: 'Spread of Virus',
 1: 'Case Statistics',
 2: 'Mask Wearing',
 3: 'Safety Measures',
 4: 'Crisis in Healthcare System',
 5: 'Impact on Education',
 6: 'Undecided',
 7: 'Testing for Virus',
 8: 'Proactive Measures (possibly)',
 9: 'Impact on travel',
 10: 'Vaccine Development',
 11: 'Undecided',
 12: 'Test Result(possibly)',
 13: 'Infection Report',
 14: 'Symptom'}
app.layout = html.Div(
    children=[
        dcc.Store(id='topics', storage_type='local'),
        dcc.Store(id='word_freq', storage_type='local'),
        dcc.Store('selected_words', 'local'),
        html.Div(id="parent1", children=[
            dcc.Dropdown(id='months_dropdown', multi=False, options=[{'label': x, 'value': x} for x in ["March", "April", "May"]], value="March", style={}),
            html.P("Topic",style={"margin":"0px","margin-top":"7px","margin-left":"10px"}),
            dcc.Dropdown(id='topics_dropdown', multi=False, options=[{'label': march_topic_names[x], 'value': x} for x in range(0,15)], value=10, style={}),
             html.P("Alpha",style={"margin":"0px","margin-top":"7px","margin-left":"10px"}),
             dcc.Input(id="alpha",type="text",value="0.01,0.02,0.03",placeholder="alpha",style={}),
             html.P("Perplexity",style={"margin":"0px","margin-top":"7px","margin-left":"10px"}),
             dcc.Input(id="Perplexity",type="number",value="75",placeholder="Perplexity",style={})
        ]),
        html.Div(id='graph_parent',children=[],style={"width":"100%"}),
        html.Div(id='graph_parent_mds',children=[],style={"width":"100%"}),
        html.Div(id='keywords_container',children=["keywords container"],style={"width":"100%"}),
        dash_table.DataTable(id='data_table',data=[], columns=[{"name": i, "id": i} for i in ["readable_tweet","subjective_prob","SentimentScore_scaled","Keywords Found"]],page_size=12,style_data={'whiteSpace': 'normal','height': 'auto'},style_cell={'textAlign': 'left'})
    ]
)

# ----------------------- Set data for data table dropdown starts here
@app.callback([Output('graph_parent', 'children'),Output('graph_parent_mds', 'children')], [Input(component_id='months_dropdown', component_property='value'),Input(component_id='topics_dropdown', component_property='value'),Input(component_id='alpha', component_property='value'),Input(component_id='Perplexity', component_property='value')], prevent_initial_call=False)
def update_my_graph(selected_month,selected_topic,alphas,Perplexity):
    #print(type(Perplexity))
    alphas=[float(alpha) for alpha in alphas.split(",")]
    df=pd.read_csv("./data/"+selected_month+".csv")
    df_by_topic=df[df['topic_number']==selected_topic].reset_index()

    f = open("./data/keywords/"+selected_month+'.json')    
    keywords_data = json.load(f)
    keywords=[i[0] for i in keywords_data[str(selected_topic)]]
    figures1=[]
    figures2=[]
    for alpha in alphas:
        fig1,fig2=get_fig(keywords,df_by_topic,alpha,selected_month,selected_topic,Perplexity)
        figures1.append(dcc.Graph(id={"type":"scatter-plot","index":alpha},figure=fig1,
        config = {'modeBarButtonsToRemove': ['toImage','autoScale2d','zoomIn2d','pan2d','select2d','zoomOut2d'], 'doubleClick': 'reset'}
        ))
        figures2.append(dcc.Graph(id={"type":"scatter-plot","index":alpha},figure=fig2,
        config = {'modeBarButtonsToRemove': ['toImage','autoScale2d','zoomIn2d','pan2d','select2d','zoomOut2d'], 'doubleClick': 'reset'}
        ))
    return figures1,figures2

def get_fig(keywords,df_by_topic,alpha,selected_month,selected_topic,Perplexity):
        df_by_topic['subjective_prob_scaled']=df_by_topic['subjective_prob'].apply(lambda x:2*x-1)
        df_by_topic["SentimentScore_scaled"]=df_by_topic["SentimentScore"]/df_by_topic["SentimentScore"].abs().max()
        df_by_topic["embedding"]=df_by_topic.apply(lambda x:map_func(x.cleaned_tweet,x.subjective_prob_scaled,x.SentimentScore_scaled,keywords,alpha),axis=1)
        #df_by_topic["keywords"]=','.join(keywords)
        df_by_topic["keywords"]=df_by_topic["cleaned_tweet"].apply(lambda x:','.join([a for a in keywords if a in x.split(' ')]))
        X=[]
        for item in df_by_topic["embedding"]:
            X.append(item)
        X_embedded = TSNE(n_components=2, perplexity=float(Perplexity),learning_rate='auto',init='random',random_state=0).fit_transform(np.array(X))
        for i in range(0,len(X_embedded)):
            df_by_topic.at[i, 'tsne_x']=X_embedded[i][0]
            df_by_topic.at[i, 'tsne_y']=X_embedded[i][1]
        
        centers = kmeans_plusplus_initializer(X, 8, kmeans_plusplus_initializer.FARTHEST_CENTER_CANDIDATE).initialize() 
        metric = distance_metric(type_metric.USER_DEFINED, func=distanceFunc)
        kmeans_instance = kmeans(X, centers, metric=metric)
        kmeans_instance.process()
        clusters = kmeans_instance.get_clusters()
        for index, cluster in enumerate(clusters):
                for instance in cluster:
                    df_by_topic.loc[df_by_topic.index[instance], 'cluster_id'] = "cluster "+str(index)

        fig1 = px.scatter(df_by_topic, x="tsne_x", y="tsne_y",color="label",title="Alpha = "+str(alpha),hover_data={"readable_tweet":False,"label":False,"subjective_prob":False,"SentimentScore":False,"SentimentScore_scaled":False,"tsne_x":False,"tsne_y":False,'cluster_id':True,"keywords":False})
        fig1.update_layout(title={'y':0.9,'x':0.5,'xanchor': 'center','yanchor': 'top'})
        fig1.update_layout(clickmode='event+select')
        fig1.update_yaxes(visible=False, showticklabels=False)
        fig1.update_xaxes(visible=False, showticklabels=False)
        fig1.update_traces(hovertemplate=None,hoverinfo='none')
        fig1.update_layout(legend=dict(orientation="h",yanchor="bottom",y=1.02,xanchor="right",x=1))
        fig1.update_layout(showlegend=True)
        fig1.update_layout(margin={"b":20,"l":5,"r":5,"t":75})
        fig1.update_layout(dragmode="lasso")
        #-----------fig 2
        embedding = MDS(n_components=2,n_init = 20,max_iter = 1000,random_state = 73073) # instantiate and set the hyperparameter
        MDS_transformed = embedding.fit_transform(X)

        df_by_topic['mds_x'] = MDS_transformed[:,0]
        df_by_topic['mds_y'] = MDS_transformed[:,1]

        fig2 = px.scatter(df_by_topic, x="mds_x", y="mds_y",color="label",title="",hover_data={"readable_tweet":False,"label":False,"subjective_prob":False,"SentimentScore":False,"SentimentScore_scaled":False,"tsne_x":False,"tsne_y":False,'cluster_id':True,"keywords":False})
        fig2.update_layout(title={'y':0.9,'x':0.5,'xanchor': 'center','yanchor': 'top'})
        fig2.update_layout(clickmode='event+select')
        fig2.update_yaxes(visible=False, showticklabels=False)
        fig2.update_xaxes(visible=False, showticklabels=False)
        fig2.update_traces(hovertemplate=None,hoverinfo='none')
        fig2.update_layout(legend=dict(orientation="h",yanchor="bottom",y=1.02,xanchor="right",x=1))
        fig2.update_layout(showlegend=False)
        fig2.update_layout(margin={"b":20,"l":5,"r":5,"t":5})
        fig2.update_layout(dragmode="lasso")
        return fig1,fig2
f = open("file.txt", "a")
def distanceFunc(point1, point2):
            f.write(str(distance.cosine(point1[:10],point2[:10]))+","+str(distance.euclidean(point1[10:12],point2[10:12]))+"\n")
            #print(distance.cosine(point1[:10],point2[:10]),distance.euclidean(point1[10:12],point2[10:12]))
            return distance.cosine(point1[:10],point2[:10])+distance.euclidean(point1[10:12],point2[10:12])*50
def map_func(cleaned_tweet,subjective_prob_scaled,SentimentScore_scaled,keywords,alpha):
    sentence_vector=[]
    for word in keywords:
        if(word in cleaned_tweet.split(" ")):
            sentence_vector.append(1)
        else:
            sentence_vector.append(0)
    temp_vector1=np.append(sentence_vector,subjective_prob_scaled*alpha)
    temp_vector2=np.append(temp_vector1,SentimentScore_scaled*alpha)
    return temp_vector2

@app.callback(Output('keywords_container', 'children'), [Input(component_id='months_dropdown', component_property='value'),Input(component_id='topics_dropdown', component_property='value'),Input({"type":"scatter-plot","index":ALL},'selectedData')], prevent_initial_call=False)
def update_keyword(selected_month,selected_topic,selectedData):
    f = open("./data/keywords/"+selected_month+'.json')    
    keywords_data = json.load(f)
    keywords=[i[0] for i in keywords_data[str(selected_topic)]]

    temp=[]
    for s_data in selectedData:
        if(s_data!=None):
            for point in s_data['points']:
                for keyword in keywords:
                    if(keyword in point['customdata'][0].split(' ')):
                        temp.append(keyword)
    temp2=[]
    for keyword in keywords:
        if keyword in temp:
            temp2.append(html.P(keyword,className="found"))
        else:
            temp2.append(html.P(keyword))
        

    return temp2

@app.callback(Output('data_table',"data"), [Input({"type":"scatter-plot","index":ALL},'selectedData'),Input({"type":"scatter-plot","index":ALL},'id')], prevent_initial_call=True)
def update_table(selectedData,id):
    temp=[]
    for s_data in selectedData:
        if(s_data!=None):
            for point in s_data['points']:
                temp.append({"readable_tweet":point['customdata'][0],"label":point['customdata'][1],"subjective_prob":round(point['customdata'][2],4),"SentimentScore":round(point['customdata'][3],4),"SentimentScore_scaled":point['customdata'][4],"Keywords Found":point['customdata'][6]})
            return temp
    return dash.no_update

if __name__ == '__main__':
    app.run_server(debug=True, host="0.0.0.0", port="8051")
