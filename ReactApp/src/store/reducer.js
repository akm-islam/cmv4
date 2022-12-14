let initialState = {
   counter: 10,
   original_data: [],
   selected_topic:"Spread of Virus",
   selected_topic_number:"0",
   keywords_data:null,
   topic_data:null,
   color : { "Expert": "rgb(31, 120, 180,0.8)", "Non Expert": "rgb(253, 191, 111,0.8)" }
};
const reducer = (state = initialState, action) => {
   if (action.type === "topic_data") {
      return { ...state, topic_data: action.value }
   }
   if (action.type === "keywords_data") {
      return { ...state, keywords_data: action.value }
   }
   if (action.type === "selected_topic_number") {
      return { ...state, selected_topic_number: action.value }
   }
   if (action.type === "selected_topic") {
      return { ...state, selected_topic: action.value }
   }
   if (action.type === "original_data") {
      var original_data2 = action.value.map(item => {
         item["SentimentScore"]=parseFloat(item["SentimentScore"])
         item["subjective_prob"]=parseFloat(item["subjective_prob"])
         item["objective_prob"]=parseFloat(item["objective_prob"])
         return item
     })
      return { ...state, original_data: original_data2 }
   }
   return state;
};
export default reducer;
