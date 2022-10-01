export function get_data_combination(data){
    var subjectivity_ranges={'subjective':[0,0.5],'objective':[0.5,1]},
    sentiment_ranges={'negative':[-100,-26],'neutral':[-25.9,25.9],'postive':[26,100]}
    var data2=[]
    var subjectivity=['subjective','objective'],
    sentiment=['negative','neutral','postive'],
    expertise=['Expert','Non Expert']
    var count=0
    expertise.map(exp=>{
        sentiment.map(sent=>{
            subjectivity.map(sub=>{
                count++
                data.map(item=>{
                    if(item['SentimentScore']>sentiment_ranges[sent][0] && item['SentimentScore']<sentiment_ranges[sent][1] 
                    && item['subjective_prob']>subjectivity_ranges[sub][0] && item['subjective_prob']<subjectivity_ranges[sub][1]
                    && item['label']==exp){
                        item['group']="group"+count
                        data2.push(item)
                    }
                })
            })
        })
    })

    return data2
}