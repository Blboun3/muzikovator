var cloned = $("#main").html()

var chords = new Array();

$.get("chords.json", function( data ) {
    chords = (data.chords)
});

function checkInput(input){
    if($("#rev_finder").prop("checked")){
        input.value = input.value.replaceAll("b","♭").toUpperCase().replaceAll("#", "♯").replaceAll("X", "♯").replaceAll(/([^C,D,E,F,G,A,B, ,♯,♭])+/g, "");
    }
    //console.log(input.value);
}

var conversionTable = {
        "Db":"Cs",
        "Eb":"Ds",
        "Gb":"Fs",
        "Ab":"Gs",
        "Bb": "As"
    }

function printRes(res){
    let lines = Math.ceil(res.length/2);
    let html = '<link rel="stylesheet" href="style2.css">';
    for(let i = 0; i < lines; i++){
        html += `<div class="row">`;
        let name = '';
        let names = new Array();
        if(res[i*2].root_note.endsWith("s")){
            name = res[i*2].alt_name[0].replace("s","♯");
            for(let r = 1; r < res[i*2].alt_name.length; r++){
                names.push(res[i*2].alt_name[r].replace("s", "♯"))
            }
            
        } else {
            name = res[i*2].alt_name[0];            
            names = res[i*2].alt_name.slice(1).toString()
        }

        //console.log(names)
        html += `<div class="column">`
        html += `<h2><b>${name}</b> <i class="otherName">(${names})</i></h2>`
        html += `<h3>${res[i*2].tones.toString().replaceAll(",", " ").replaceAll("s", "♯")}</h3>`
        html += `<p>${i*2}</p>`
        html += `</div>`
        name = '';
        let x = i*2+1
        if (x == res.length ) {
            break;
        }

        names = new Array();
        if(res[x].root_note.endsWith("s")){
            name = res[x].alt_name[0].replace("s","♯");
            for(let r = 1; r < res[x].alt_name.length; r++){
                names.push(res[x].alt_name[r].replace("s", "♯"))
            }
            
        } else {
            name = res[x].alt_name[0];
            names = res[x].alt_name.slice(1).toString()
        }
        
        html += `<div class="column">`
        html += `<h2><b>${name}</b> <i class="otherName">(${names})</i></h2>`
        html += `<h3>${res[x].tones.toString().replaceAll(",", " ").replaceAll("s", "♯")}</h3>`
        html += `<p>${x}</p>`
        html += `</div>`
        html += `</div>`;
    }
    //console.log(html)
    return html;
}


$(".chord_sel_link").click(function() {
    let html = "";
    $("#search").val("");
    let root_note = $(this).attr("id").substring(6)
    let res = chords.filter(chord => chord.root_note == root_note);
    res.sort(function(a, b) {
        return a.priority - b.priority;
      });
    html += printRes(res);
    $("#main").html(html)
    
});

$("#title").click(function() {
    $("#main").html(cloned);
    $("#search").val("");
});


function searchChord(inputNotes) {
    var allowed = new Array();
    chords.forEach((current) => {
        let trueCounter = 0;
        for(let i = 0; i < inputNotes.length; i++){
            if(current.tones.includes(inputNotes[i])){
                trueCounter++;
            }
        }
        if(trueCounter == inputNotes.length){
            allowed.push(current)
        }
    });
    return allowed;
}

function searchChordName(name){
    let x = new Array();
    chords.forEach(function (element) {
        //console.log(element);
        if(element.alt_name.toString().toUpperCase().includes(name.toUpperCase())){
            //console.log(element)
            x.push(element);
        }
    });
    //console.log(x)
    return x;
}

function searchChordBox() {
    if($("#rev_finder").prop("checked")){
        //console.log($("#search").val());
        let x = $("#search").val().split("")
        let y = new Array();
        x.forEach(function (element, index) {
            //console.log(element)
                if (element != " ") {
                    //console.log(element);
                    if(element == "♯" || element == "♭"){
                        y[index-1] = y[index-1] + element.replace("♯", "s").replace("♭", "b")
                    } else {
                        y.push(element);
                    }

                }
            });
        let z = new Array()
        y.forEach((element) => {
            if(conversionTable.hasOwnProperty(element.toString())) {
                z.push(conversionTable[element]);
            } else {
                 z.push(element);
            }
        });
        //console.log(z)
        let res = searchChord(z);
        let html = printRes(res);
        //console.log(html)
        $("#main").html(html)
    } else {
        let res = searchChordName($("#search").val().replace("#", "s"));
        res.sort(function(a, b) {
            return a.priority - b.priority;
          });
        //console.log(res)
        let html = printRes(res);
        //console.log(html)
        $("#main").html(html)
    }
}

$("#rev_finder").change(function(){
    searchChordBox();
  }); 