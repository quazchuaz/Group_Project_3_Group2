let data
fetch('http://127.0.0.1:5000/api/v1.0/airquality_data')
    .then((response)=>response.json())
    .then((jsondata)=>data=jsondata)
    .catch((e)=>console.log(e))

const selectEL=document.getElementById('lineGraphSelect')
selectEL.addEventListener('change',(event)=>{
  
    const x = data.map((d)=>d.date)
    const y = data.map((d)=>d[event.target.value])
    const plotdata = [
        {
            x:x,
            y:y,
            type:'scatter'
        }
    ]
    Plotly.newPlot('lineGraphPlot',plotdata)
})