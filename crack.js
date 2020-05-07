function strReplaceAt (str, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}

function removeCharInstance(from, has) {
    let ret = from;
    for (let i = 0; i < has.length; i++) {
        ret = ret.replace(has[i], '');
    }
    return ret;
}

function rotateStringRight(str) {
    return str[str.length - 1] + str.slice(0, str.length - 1);
}

/* NOTE: str1 and str2 has to be the same length */
function getSimilarity(str1, str2) {
    let sims = 0;
    for (let i = 0; i<str1.length; i++)
        if (str1[i] == str2[i]) sims++;
    return sims;
}

function getStringOfPlug(obj) { // convertes a plugboard object to string
    return JSON.stringify(obj).replace('{', '').replace('}', '').replace(/\"(\w)\":\"(\w)\"/gm, '$1:$2');
}

function getCycle(string) {
    let rem = "BCDEFGHIJKLMNOPQRSTUVWXYZ";
    let cycles = ['A'];
    let i = 0;
    let last = 0;
    while (rem.length > 0) {
        let cur = string[last];

        if (cycles[i].indexOf(cur) !== -1) {
            cycles.push(rem[0]);
            last = toCharI(rem[0]);
            rem = rem.slice(1);
            i++;
        } else {
            cycles[i] += cur;
            rem = rem.replace(cur, '');
            last = toCharI(cur);
        }
    }

    return cycles;
}

/* Will return a string signature of the cycle for the given ciphered text */
function getCycleSignature(unknowns) {
    let sig = ''
    for (let j = 0; j < unknowns.length; j++) {
        const unknown = unknowns[j];
        let cycles = getCycle(unknown);

        for (let i = 0; i < cycles.length; i++) cycles[i] = cycles[i].length;
        cycles.sort(function(a, b){return b-a;});

        for (let i = 0; i < cycles.length; i++) {
            if (i != 0) sig += '-';
            sig += cycles[i];
        }

        if (j != unknowns.length-1) sig += ' ';
    }
    return sig;
}

function getLast(str) {
    return str[str.length - 1];
}

/* This gives you the cycle signature associated with the given table */
function constructTableSignature(table) {
    
    let cycles = [[table[0][0]+table[0][3]], [table[0][1]+table[0][4]], [table[0][2]+table[0][5]]];
    // This loop automates the same patter for p4.p1 & p5.p2 & p6.p3 based on the offset from i
    let sig = '';
    for (let i = 0; i<3; i++) {
        let rem = removeCharInstance("ABCDEFGHIJKLMNOPQRSTUVWXYZ", cycles[i][0]);
        while (rem.length > 0) {
            const last = toCharI(getLast(getLast(cycles[i])));
            const cur = table[toCharI(table[last][i+0])][i+3];
            if (rem.indexOf(cur) !== -1) { // Add only if this is in the list of remaining.
                rem = rem.replace(cur, ''); // Remove this from the list of remaining.
                cycles[i][cycles[i].length-1] += cur;
            } else {
                cycles[i].push(rem[0]);
                rem = rem.slice(1);
            }
        }

        let each = cycles[i];
        for (let j = 0; j < each.length; j++) {
            cycles[i][j] = cycles[i][j].length;
        }
        cycles[i].sort(function(a, b){return b-a;});
        for (let j = 0; j < each.length; j++) {
            sig += cycles[i][j];
            if (j != each.length-1) sig += '-'
        }
        if (i != 2) sig += ' '
    }
    return sig;
}

/*
 Generate the signature of cycles for the alphabets. the key is in the form "10-10-6 23-3 13-10-2-1" 
 NOTE: This only generates the cycle for rotors 1,2 & 3; The value at the key is of the form r1-r2-r3 p1-p2-p3
 where r means rotor and p means rotos position
*/
function generateCycleSignature() {
    let sigs = {};
    const rots = [
        [[M3_ROTOR1, M3_ROTOR1_KNOCK], [M3_ROTOR2, M3_ROTOR2_KNOCK], [M3_ROTOR3, M3_ROTOR3_KNOCK]],
        [[M3_ROTOR1, M3_ROTOR1_KNOCK], [M3_ROTOR3, M3_ROTOR3_KNOCK], [M3_ROTOR2, M3_ROTOR2_KNOCK]],
        [[M3_ROTOR2, M3_ROTOR2_KNOCK], [M3_ROTOR3, M3_ROTOR3_KNOCK], [M3_ROTOR1, M3_ROTOR1_KNOCK]],
        [[M3_ROTOR2, M3_ROTOR2_KNOCK], [M3_ROTOR1, M3_ROTOR1_KNOCK], [M3_ROTOR3, M3_ROTOR3_KNOCK]],
        [[M3_ROTOR3, M3_ROTOR3_KNOCK], [M3_ROTOR1, M3_ROTOR1_KNOCK], [M3_ROTOR2, M3_ROTOR2_KNOCK]],
        [[M3_ROTOR3, M3_ROTOR3_KNOCK], [M3_ROTOR2, M3_ROTOR2_KNOCK], [M3_ROTOR1, M3_ROTOR1_KNOCK]]
    ];

    const rot_names = ['1-2-3', '1-3-2', '2-3-1', '2-1-3', '3-1-2', '3-2-1'];
    
    for (let p = 0; p < 6; p++) {
        const cur_rot = rots[p];
        for (let x = 0; x < 26; x++) {
            for (let y = 0; y < 26; y++) {
                for (let z = 0; z < 26; z++) {
                    const pos1 = String.fromCharCode(65 + x);
                    const pos2 = String.fromCharCode(65 + y);
                    const pos3 = String.fromCharCode(65 + z);

                    let table = [];
                    for (let a = 0; a < 26; a++) {
                        let e = new Enigma({rotors: [cur_rot[0][0], cur_rot[1][0], cur_rot[2][0]],
                            knocks: [cur_rot[0][1], cur_rot[1][1], cur_rot[2][1]], plugs: {}, reflector: UKW_B, positions: [pos1, pos2, pos3]});
                        table.push(e.cipher(String.fromCharCode(65 + a).repeat(6)));
                    }
                    let cycle = constructTableSignature(table);
                    // let cycle = getCycleSignature(unknowns);
                    const sig = rot_names[p] + ' ' + pos1 + '-' + pos2 + '-' + pos3;
                    if (sigs[cycle] === undefined)
                        sigs[cycle] = [sig];
                    else
                        sigs[cycle].push(sig);
                }
            }
        }
        console.log("Permutation ", rot_names[p], " finished");
    }

    return sigs;
}

function findAnyCharMatch(str, l_str) {
    for (let i = 0; i < str.length; i++) {
        const to_search = str[i];
        for (let j = 0; j < l_str.length; j++) {
            const idx = l_str[j].indexOf(to_search);
            if (idx != -1) return j;
        }
    }
    return -1;
}

function tryPermutation(current, to_match) {
    let bestScore = getSimilarity(current, to_match);
    let bestMatch = current
    for (let i = 1; i < current.length; i++) {
        current = rotateStringRight(current);
        if (getSimilarity(current, to_match) > bestScore) {
            bestScore = getSimilarity(current, to_match);
            bestMatch = current;
        }
    }
    return [bestScore, bestMatch];
}

function checkSetting() {

}

function crack(intercepted) {
    let unknowns = ['99999999999999999999999999', '99999999999999999999999999', '99999999999999999999999999']; // temps
    // let bydiff = {};
    let possibles = [];

    for (let i = 0; i < intercepted.length; i++) {
        if (intercepted[i].length < 6) continue;
        const mesg = intercepted[i].slice(0, 6);
        unknowns[0] = strReplaceAt(unknowns[0], toCharI(mesg[0]), mesg[3]);
        unknowns[1] = strReplaceAt(unknowns[1], toCharI(mesg[1]), mesg[4]);
        unknowns[2] = strReplaceAt(unknowns[2], toCharI(mesg[2]), mesg[5]);
    }
    
    // TODO: We need a way to match exactly if theres no difference which means no plugboard was used.
    let cycle = getCycleSignature(unknowns);
    console.log(cycle);
    if (cycle in signature_db) {
        const sigs = signature_db[cycle];
        console.log("We've got", sigs.length, "number of matches");
        console.log("We've got", sigs);
        for (let j = 0; j < sigs.length; j++) {
            // 2-1-3 V-Q-S
            let rots = getRotorsFromSig(sigs[j].split(' ')[0]);
            const poss = sigs[j].split(' ')[1].split('-').join('');
            possibles.push({sig: sigs[j], rots: rots, pos: [poss[0], poss[1], poss[2]]});
        }
        return possibles;
    } else {
        console.error("No signature was found for this interception :(");
        return false;
    }
}

function generateCycleFromRot(rots, pos) {
    let table = [];
    for (let a = 0; a < 26; a++) {
        let e = new Enigma({rotors: [rots[0][0], rots[1][0], rots[2][0]],
            knocks: [rots[0][1], rots[1][1], rots[2][1]], plugs: {}, reflector: UKW_B, positions: [pos[0], pos[1], pos[2]]});
        table.push(e.cipher(String.fromCharCode(65 + a).repeat(6)));
    }

    let cycles = [[table[0][0]+table[0][3]], [table[0][1]+table[0][4]], [table[0][2]+table[0][5]]];
    // This loop automates the same patter for p4.p1 & p5.p2 & p6.p3 based on the offset from i
    let sig = '';
    for (let i = 0; i<3; i++) {
        let rem = removeCharInstance("ABCDEFGHIJKLMNOPQRSTUVWXYZ", cycles[i][0]);
        while (rem.length > 0) {
            const last = toCharI(getLast(getLast(cycles[i])));
            const cur = table[toCharI(table[last][i+0])][i+3];
            if (rem.indexOf(cur) !== -1) { // Add only if this is in the list of remaining.
                rem = rem.replace(cur, ''); // Remove this from the list of remaining.
                cycles[i][cycles[i].length-1] += cur;
            } else {
                cycles[i].push(rem[0]);
                rem = rem.slice(1);
            }
        }
    }

    // console.log(cycles);
    
    return cycles;
}

let inter = encryptMultiInEnigmaProtocol([M3_ROTOR1, M3_ROTOR2, M3_ROTOR3], [M3_ROTOR1_KNOCK, M3_ROTOR2_KNOCK, M3_ROTOR3_KNOCK], {'A': 'C', 'M': 'D', 'F': 'H', 'L': 'O', 'P': 'Z'}, UKW_B, ['G', 'J', 'C'], [['C','M','C'],['B','C','A'],['F','U','D'],['K','O','P'],['H','B','H'],['J','I','S'],['I','S','B'],['N','Z','O'],['Y','J','X'],['G','D','F'],['Q','X','Z'],['O','U','Y'],['D','H','E'],['L','Z','R'],['V','K','Z'],['T','L','I'],['S','U','Q'],['W','U','M'],['Z','W','U'],['T','T','N'],['E','Y','S'],['U','M','T'],['T','V','M'],['T','X','G'],['P','S','V'],['T','G','W'],['M','A','T'],['R','Y','T'],['A','S','L'],['W','N','O'],['T','S','T'],['A','R','K'],['Z','P','J'],['T','E','W'],['T','Q','D'],['X','S','S'],['W','F','N']], ['Thisisasmallstringtest','Youcanreadthisifyoujust','gettheADC','Thisisnotajoke','Ihopethisworks','Ifthisworksonthefirst','tryihavetodo','somethingtoyou','maybeillfinally','turnmypcoff','foranentireday','youvebeengoodtome','currentuptimeis','twentydaysoof','okayyeahineedto','shutdownthiscomputer','todaynomatterwhat','ijusthatehavingto','reloadthetabsivebeen','workingonfirefox','godwhyidokeepchecking','myphoneiamanticipating','speakingofineedto','gosendsnapchatstreaks','forthedayihope','tosleepbefore2today','ialsohopethisworksonthefirsttry','oknvmthefirsttry','wasnotasuccessas','ihadhopedbutiwasableto','quicklyfigureoutwhy','whichisthereasonamadding','moredatatothislist','hopefullyinoneofthis','thekeygetsumixedand','everythingshouldbecome','visiblealrpraythisworks']);
// console.log(inter);
crack(inter);

// var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generateCycleSignature()));

// var a = document.createElement('a');
// a.href = 'data:' + data;
// a.download = 'data.json';
// a.innerHTML = 'download JSON';

// var container = document.getElementsByTagName('body')[0];
// container.appendChild(a);
