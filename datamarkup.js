// Ordered list of natural/sharp notes, doubled
var sharps= ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B','C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

// Ordered list of natural/flat notes, doubled
var flats = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B','C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

// Object containing 6th string fret numbers to apply to scale figures
var rootFrets = {'C':8,'C#':9,'D':10,'D#':11,'E':12,'F':1,'F#':2,'G':3,'G#':4,'A':5,'A#':6,'B':7};

// Array of likely invalid data to be included with chords
var invalids=[' ','sus','maj','ma','SUS','MAJ','MA','sus2','SUS2','sus4','SUS4',1,2,3,4,5,6,7,8,9,0]

// Various variables
var chordInput = document.getElementById("chordInput");
var chordList = [];
var all_keys = {};
var all_notes = {};

// Returns validated chord array, called to generate all_keys object
function getNotes(start,lookin){
    var endIndex = start + 12;
    var chromatic = lookin.slice(start, endIndex);
    var major = [chromatic[0],chromatic[2]+'m',chromatic[4]+'m',chromatic[5],chromatic[7],chromatic[9]+'m']
    return major
};

// Returns validated note array, called to generate all_notes object
function getJustNotes(start,lookin){
    var endIndex = start + 12;
    var chromatic = lookin.slice(start, endIndex);
    var major = [chromatic[0],chromatic[2],chromatic[4],chromatic[5],chromatic[7],chromatic[9]]
    return major
};

// Creates dict of all keys for comparison against user-provided chords
function makeAllKeys() {
    for(i=0;i<12;i++){
    all_keys[sharps[i]] = getNotes(i,sharps);
    }
    return all_keys
}

// Creates dict of all notes in each key for display on scale sheets
function makeAllNotes() {
    for(i=0;i<12;i++){
    all_notes[sharps[i]] = getJustNotes(i,sharps);
    }
    return all_notes
}


// Removes repeats from user-generated chords, prevents generation of invalid key logic
function chordsOnly(mList){
    strippedList = []
        for(i=0;i<mList.length;i++){
            if(!strippedList.includes(mList[i])){
                strippedList.push(mList[i])
            }
        }
    return strippedList
    }
// Gets likely key from chord list
function compareKeys(cList){
    console.log('compareKeys start')
    
    // Unique chords only
    var dlist=chordsOnly(cList);
    var kList = []
    
    // Blank array for holding score values key names, used in error check
    var scores = []
    var keys = []

    //Run chord list against all keys
    for(i=0;i<12;i++){
        var scoretest = scoreit(dlist,all_keys[sharps[i]])
        scores.push(scoretest)
        keys.push(sharps[i])
    }

    // Check for max in score array
    var score_max = Math.max(...scores);

    // Loop through score array and finds index of all max, adds that value from the key list to the final return
    for(i=0;i<scores.length;i++){
        if(scores[i]===score_max){
            kList.push(keys[i])
        }
    }

    // Clears chordlist
    cList=[]

    // Logic for displaying key info
    if(kList.length===1){
        var flashtext = `${kList.length} possible key identified`
        console.log('One key identified, flashtext value: ' + flashtext)
    }
    else{var flashtext = `${kList.length} possible keys identified`

    // Checks for invalid chord combinations for info display
    if(Math.max(...scores)<=0){
        console.log('No key determination')
        document.getElementById("chordDisplay").innerText='Invalid chord combination'}
    else{
        document.getElementById("chordDisplay").innerHTML = flashtext
        }

        return kList

}}

// Used to compare provided chords to key list
function scoreit(chords,key){
    score = 0
    for(x=0;x<chords.length;x++){
        if(key.includes(chords[x])){
            score +=1}
            else {score -=1}
    }
    return score
}

// Collects and validates user input
function chordListBuilder(){
    var pChord = document.getElementById("chordInput").value

    // Replaces invalid text with blank
    for(i=0;i<invalids.length;i++){
        pChord = pChord.replace(invalids[i], "")
    }

    // Converts any provided flats into sharps
    if(pChord.includes('b')){
        console.log('flat identified')
        pChord=pChord.replace(pChord.substring(0,2),sharps[flats.indexOf(pChord.substring(0,2))])
    }

    // Add validated chord to chord list, removes chord from entry box and displays chords
    chordList.push(pChord)
    document.getElementById("chordInput").value=""
    document.getElementById("chordDisplay").innerHTML=chordList
}

// Generates display data from selected chords
async function keyDisplayBuilder(){
    var target_key = compareKeys(chordList)

    // Checks for invalid chord combination and resets if founc
    if(document.getElementById("chordDisplay").innerText==='Invalid chord combination'){
        console.log('invalid chord list')
        reset()}

    // 
    else{await sleep(500)
        
        // Set length for data processing
        numKeys = target_key.length

            // Loops through provided key names, generates root fret and scale name for each validated key
            for(i=0;i<=numKeys;i++){
                console.log('i value: ' + i)
                var thisKey = all_notes[target_key[i]]
                console.log('Trying to access target_key[i]: '+ target_key[i])
                //console.log('myKey is: ' + myKey)
                document.getElementById('collapse'+(i+1)+'but').innerText = 'Key of ' + target_key[i]
                document.getElementById('ionian'+(i+1).toString()).innerText = all_notes[target_key[i]][0] + ' Ionian'
                document.getElementById('ionian'+(i+1).toString()+"Root").innerText = 'Root fret: ' + rootFrets[thisKey[0]]
                document.getElementById('dorian'+(i+1).toString()).innerText = all_notes[target_key[i]][1]+ ' Dorian'
                document.getElementById('dorian'+(i+1).toString()+"Root").innerText = 'Root fret: ' + rootFrets[thisKey[1]]
                document.getElementById('phrygian'+(i+1).toString()).innerText = all_notes[target_key[i]][2] + ' Phrygian'
                document.getElementById('phrygian'+(i+1).toString()+"Root").innerText = 'Root fret: ' + rootFrets[thisKey[2]]
                document.getElementById('lydian'+(i+1).toString()).innerText = all_notes[target_key[i]][3]+ ' Lydian'
                document.getElementById('lydian'+(i+1).toString()+"Root").innerText = 'Root fret: ' + rootFrets[thisKey[3]]
                document.getElementById('mixolydian'+(i+1).toString()).innerText = all_notes[target_key[i]][4] + ' Mixolydian'
                document.getElementById('mixolydian'+(i+1).toString()+"Root").innerText = 'Root fret: ' + rootFrets[thisKey[4]]
                document.getElementById('aolian'+(i+1).toString()).innerText = all_notes[target_key[i]][5]+ ' Aolian'
                document.getElementById('aolian'+(i+1).toString()+"Root").innerText = 'Root fret: ' + rootFrets[thisKey[5]]
                document.getElementById('blues'+(i+1).toString()).innerText = all_notes[target_key[i]][5]+ ' Blues'
                document.getElementById('blues'+(i+1).toString()+"Root").innerText = 'Root fret: ' + rootFrets[thisKey[5]]
                }   

        // Hides non-essential chord panels
        if(numKeys===1){
            document.getElementById("collapse2").style.display = "none"
            document.getElementById("collapse3").style.display = "none"
            document.getElementById("collapse2but").style.display = "none"
            document.getElementById("collapse3but").style.display = "none"
        }
        else if(numKeys===2){
            document.getElementById("collapse3").style.display = "none"
            document.getElementById("collapse3but").style.display = "none"
        }
    


    //showCpanel()
    //showButtons()
    showCpanel()
    chordList=[]
    $('.collapse').collapse()
}}

// Hides chord display during entry
function hideCpanel(){
    document.getElementById("hidepane").style.visibility = "hidden"
}

// Shows chord display post-entry
function showCpanel(){
    document.getElementById("hidepane").style.visibility = "visible"
}

function reset(){
    console.log('Reset called')
    chordList=[]
    hideCpanel()
    document.getElementById("chordDisplay").innerText==='Enter Chords'
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// Run on load
hideCpanel()
makeAllKeys()
makeAllNotes()

function hider () {
    $(".chordPanel").collapse()}

function confirmIt(){
    console.log("Confirmed")
}

// hider()
confirmIt()

// D3 listeners
d3.selectAll("#addChord").on("click", function(){chordListBuilder()})
d3.selectAll("#getKey").on("click", function(){keyDisplayBuilder()})