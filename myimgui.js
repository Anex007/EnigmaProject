SystemJS.config({
    map: {
        "imgui-js": "https://flyover.github.io/imgui-js"
    },
    packages: {
        "imgui-js": { main: "imgui.js" }
    }
});
let ImGui;
let ImGui_Impl;
Static = class Static {
    constructor(value) {
        this.value = value;
    }
};
_static = {};

function STATIC(key, value) {
    return _static[key] || (_static[key] = new Static(value));
}

function getRandomInt() {
    return Math.trunc(Math.random() * 100);
}

function getRandInitPositions() {
    let alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let pos = [];
    for (let i = 0; i < 3; i++) {
        pos.push(alphabets[getRandomInt() % alphabets.length]);
    }
    return pos;
}

function getKnocksFromRotors(rots) {
    let knocks = [];
    for (let i = 0; i < rots.length; i++) {
        knocks.push(getKnockFromRotor(rots[i]));
    }
    return knocks;
}

Promise.resolve().then(() => {
    return System.import("imgui-js").then((module) => {
        ImGui = module;
        return ImGui.default();
    });
}).then(() => {
    return System.import("imgui-js/example/imgui_impl").then((module) => {
        ImGui_Impl = module;
    });
}).then(() => {

    const canvas = document.getElementById("output");
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.scrollWidth * devicePixelRatio;
    canvas.height = canvas.scrollHeight * devicePixelRatio;
    window.addEventListener("resize", () => {
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = canvas.scrollWidth * devicePixelRatio;
        canvas.height = canvas.scrollHeight * devicePixelRatio;
    });

    ImGui.CreateContext();
    ImGui_Impl.Init(canvas);

    ImGui.StyleColorsDark();
    //ImGui.StyleColorsClassic();

    const clear_color = new ImGui.ImVec4(0.45, 0.55, 0.60, 1.00);

    /* static */ let buf = "Quick brown fox";
    /* static */ let f = 0.6;

    function HelpMarker(desc) {
        ImGui.TextDisabled("(?)");
        if (ImGui.IsItemHovered()) {
            ImGui.BeginTooltip();
            ImGui.PushTextWrapPos(ImGui.GetFontSize() * 35.0);
            ImGui.TextUnformatted(desc);
            ImGui.PopTextWrapPos();
            ImGui.EndTooltip();
        }
    }

    let done = false;
    window.requestAnimationFrame(_loop);
    function _loop(time) {
        ImGui_Impl.NewFrame(time);
        ImGui.NewFrame();

        ImGui.SetNextWindowPos(new ImGui.ImVec2(20, 20), ImGui.Cond.FirstUseEver);
        ImGui.SetNextWindowSize(new ImGui.ImVec2(294, 140), ImGui.Cond.FirstUseEver);
        ImGui.Begin("Debug");

        ImGui.Text(`Application average framerate ${(1000.0 / ImGui.GetIO().Framerate).toFixed(3)} ms/frame (${ImGui.GetIO().Framerate.toFixed(1)} FPS)`);

        ImGui.End();

        ImGui.Begin('Enigma Cracker');
        const intercepted = STATIC("intercepted", new ImGui.ImStringBuffer(1024 * 16, ''));
        const random_inter = STATIC('random_inter', new ImGui.ImStringBuffer(1024 * 16, ''));

        if (ImGui.CollapsingHeader("Create Test Interception")) {
            ImGui.InputTextMultiline('##random_inter', random_inter.value, random_inter.value.size, new ImGui.ImVec2(-1.0, ImGui.GetTextLineHeight() * 8), ImGui.ImGuiInputTextFlags.ReadOnly);
            if (ImGui.Button("Generate Interception")) {
                let rots_to_choose = [[M3_ROTOR1, M3_ROTOR1_KNOCK], [M3_ROTOR2, M3_ROTOR2_KNOCK], [M3_ROTOR3, M3_ROTOR3_KNOCK]];// You have to make sure there wont be a bug by giving the value twice.
                let rots = [];
                for (let i = 0; i < 3; i++) {
                    const idx = getRandomInt() % rots_to_choose.length;
                    rots.push(rots_to_choose.splice(idx, 1)[0]);
                }

                let plugs = {}
                const num_plugs = 4 + getRandomInt() % 3;
                let alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                for (let i = 0; i < num_plugs; i++) {
                    const k = alphabets.splice(getRandomInt() % alphabets.length, 1)[0];
                    const v = alphabets.splice(getRandomInt() % alphabets.length, 1)[0];
                    plugs[k] = v;
                }

                let inter = encryptMultiInEnigmaProtocol([rots[0][0], rots[1][0], rots[2][0]], [rots[0][1], rots[1][1], rots[2][1]], plugs, UKW_B, getRandInitPositions(), [['C','M','C'],['B','C','A'],['F','U','D'],['K','O','P'],['H','B','H'],['J','I','S'],['I','S','B'],['N','Z','O'],['Y','J','X'],['G','D','F'],['Q','X','Z'],['O','U','Y'],['D','H','E'],['L','Z','R'],['V','K','Z'],['T','L','I'],['S','U','Q'],['W','U','M'],['Z','W','U'],['T','T','N'],['E','Y','S'],['U','M','T'],['T','V','M'],['T','X','G'],['P','S','V'],['T','G','W'],['M','A','T'],['R','Y','T'],['A','S','L'],['W','N','O'],['T','S','T'],['A','R','K'],['Z','P','J'],['T','E','W'],['T','Q','D'],['X','S','S'],['W','F','N']], ['Yourbraingetssmartbutyourheadgetsdumb','Somebodyoncetoldmetheworldisgonnarollme','Gettheshowongetpaid','TheythoughttheywasallofthatThenyoushowedupandbamThey','ListenlittledonkeyTakealookatmeWhatamI','beconsideredafreakWellmaybeyoudoButthatswhywegotta','Hehuffedundhepuffedundhesignedanevictionnotice','OkayIlltellyouDoyouknowthemuffinman','andcleaningforhertwoevilsistersPleasewelcomeCinderella','SilenceIwillmakethisPrincessFionamyqueenandDuLocwill','ShelikessushiandhottubbinganytimeHerhobbiesincludecooking','EveningMirrormirroronthewallIsthisnotthemostperfect','curYesIknowthemuffinmanwholivesonDruryLanentuptimeis','princessjustsoFarquaadwillgiveyoubackaswampwhichyouonly','puttheirheadsonapikegottenaknifecutopentheirspleenand','runnerupwilltakehisplaceandsoonandsoforthSomeofyoumae','Thatchampionshallhavethehonornonotheprivilegetogo','runnerupwilltakehisplaceandsoonandsoforthSomeofyoumae','princessjustsoFarquaadwillgiveyoubackaswampwhichyouonly','puttheirheadsonapikegottenaknifecutopentheirspleenand','drinktheirfluidsDoesthatsoundgoodtoyou','Withadragonthatbreathesfireandeatsknightsandbreathesfire','itsuredoesntmeanyoureacowardifyourealittlescared','courseyoureagirldragonYourejustreekingoffemininebeauty','OkayyoutwoheardfortheexitIlltakecareofthedragon','HmmWithShrekYouthinkWaitWaitYouthinkthatShrekisyoutruelove','ButIhavetoberescuedbymytruelovenotbysomeprgeandhispet','theresBloodnuttheFlatulentYoucanguesswhathesfamousfor','HeyShrekwhatwegonnadowhenwegetourswampanyway','Nothisisoneofthosedropitandleaveitalonethings','LookImnottheonewiththeproblemokayItstheworldthat','seemstohaveaproblemwithmePeopletakeonelookatmeandgo','youlegselevatedTurnyourheadandcoughDoesanyoneknowthe','YouknowshesrightYoulookawfulDoyouwanttositdown','thatuglyWellIaintgonnalieYouareuglyButyouonlylook','ButDonkeyImaprincessandthisisnothowaprincessismeant','PeopleofDuLocwegatherheretodaytobearwitnsstotheunion']);

                random_inter.value.buffer = ''
                for (let i = 0; i < inter.length; i++) {
                    random_inter.value.buffer += inter[i] + '\n';
                }
            }
        }
        HelpMarker("Each transmission of Enigma needs to be on new line, ");
        ImGui.Text("Intercepted: ");
        ImGui.InputTextMultiline("##intercepted", intercepted.value, intercepted.value.size, new ImGui.ImVec2(-1.0, ImGui.GetTextLineHeight() *8));

        const crack_switch = STATIC("crack_switch", 0);
        const prev_crack = STATIC("prev_crack", []);
        const plugs_to_try = STATIC("plugs_to_try", new ImGui.ImStringBuffer(64, ""));
        const decrypted = STATIC('decrypted', new ImGui.ImStringBuffer(1024 * 16, ''));

        if (ImGui.Button("Crack")) {
            const to_crack = intercepted.value.buffer.split('\n');
            if (to_crack[0].length > 6)  prev_crack.value = crack(to_crack);
        }
        ImGui.InputText("Plugboard", plugs_to_try.value, plugs_to_try.value.size);
        HelpMarker("Starting from the top each drop down shows a possible setting that matched This assumes the reflector is UKW Beta");
        if (prev_crack.value !== false) {
            for (let i = 0; i < prev_crack.value.length; i++) {
                const cur = prev_crack.value[i];
                if (ImGui.TreeNode(cur.sig)) {
                    // if (ImGui.Button("Check")) {
                        // let engima = new Enigma({rotors: cur.rots, knocks: getKnocksFromRotors(cur.rots), plugs: plugboard, reflector: UKW_B, positions: cur.pos});
                        // Whenever This is true try outputting to decrypted.
                    // }
                    
                    ImGui.Columns(2, "Rotor Sim");
                    ImGui.Separator();
                    for (let pair = 0; pair < 3; pair++) {
                        const cur_pair = cur.base_pattern[pair];
                        for (let n = 0; n < cur_pair.length; n++) {
                            const rotation = STATIC(`rotate_string_${pair}_${n}_${cur.sig}`, 0);
                            const my_popup = `settings_popup_${pair}_${n}`;
                            if (ImGui.Button(rotateStringRightNtimes(rotation.value, cur_pair[n]))) {
                                ImGui.OpenPopup(my_popup);
                            }
                            if (ImGui.BeginPopup(my_popup)) {
                                const rotation = STATIC(`rotate_string_${pair}_${n}_${cur.sig}`, 0);
                                ImGui.SliderInt("Rotate string", (value = rotation.value) => rotation.value = value, 0, cur_pair[n].length-1);
                                ImGui.EndPopup();
                            }
                            ImGui.SameLine();
                        }
                        ImGui.NewLine();
                        ImGui.NextColumn();
                        const to_match = cur.pattern_to_match[pair];
                        for (let n = 0; n < to_match.length; n++) {
                            const rotation = STATIC(`rotate_string_${pair}_${n}_${cur.sig}`, 0);
                            let err_color = checkSetting(getPlugFromString(plugs_to_try.value.buffer), cur_pair[n], rotateStringRightNtimes(rotation.value, to_match[n])) ? new ImGui.ImVec4(0.0, 1.0, 0.0, 1.0): new ImGui.ImVec4(1.0, 0.0, 0.0, 1.0);
                            ImGui.TextColored(err_color, to_match[n]);
                            ImGui.SameLine();
                        }
                        ImGui.NextColumn();
                    }

                    ImGui.Columns(1);
                    ImGui.Separator();
                    ImGui.TreePop();
                }
            }
        } else {
            ImGui.TextColored(new ImGui.ImVec4(1.0, 0.0, 0.0, 1.0), "No Signature was matched :(");
        }
        ImGui.Text("Decrypted: ");
        ImGui.InputTextMultiline('##decrypted', decrypted.value, decrypted.value.size, new ImGui.ImVec2(-1.0, ImGui.GetTextLineHeight() * 8), ImGui.ImGuiInputTextFlags.ReadOnly);

        ImGui.End();

        ImGui.Begin("Enigma Simulator");
        const ROTORNAMES = ['I', 'II', 'III', 'IV', 'V'];
        const REFLETORNAMES = ['UKW_B', 'UKW_C'];

        const rotor1_cur = STATIC("rotor1_cur", 0);
        const rotor2_cur = STATIC("rotor2_cur", 1);
        const rotor3_cur = STATIC("rotor3_cur", 2);
        const reflector_cur = STATIC("reflector_cur", 0);
        const pos1 = STATIC("pos1", new ImGui.ImStringBuffer(2, "A"));
        const pos2 = STATIC("pos2", new ImGui.ImStringBuffer(2, "A"));
        const pos3 = STATIC("pos3", new ImGui.ImStringBuffer(2, "A"));
        const plugs = STATIC("plugs", new ImGui.ImStringBuffer(64, ""));
        const input = STATIC('input', new ImGui.ImStringBuffer(1024 * 16, ''));
        const output = STATIC('output', new ImGui.ImStringBuffer(1024 * 16, ''));

        ImGui.Combo("Rotor 1", (value = rotor1_cur.value) => rotor1_cur.value = value, ROTORNAMES, ROTORNAMES.length);
        ImGui.Combo("Rotor 2", (value = rotor2_cur.value) => rotor2_cur.value = value, ROTORNAMES, ROTORNAMES.length);
        ImGui.Combo("Rotor 3", (value = rotor3_cur.value) => rotor3_cur.value = value, ROTORNAMES, ROTORNAMES.length);
        ImGui.Combo("Reflector", (value = reflector_cur.value) => reflector_cur.value = value, REFLETORNAMES, REFLETORNAMES.length);
        ImGui.PushItemWidth(30);
        ImGui.InputText("position 1", pos1.value, pos1.value.size, ImGui.ImGuiInputTextFlags.CharsUppercase);
        ImGui.SameLine();
        ImGui.InputText("position 2", pos2.value, pos2.value.size, ImGui.ImGuiInputTextFlags.CharsUppercase);
        ImGui.SameLine();
        ImGui.InputText("position 3", pos3.value, pos3.value.size, ImGui.ImGuiInputTextFlags.CharsUppercase);
        ImGui.PushItemWidth(400);
        ImGui.InputText("Pluboard", plugs.value, plugs.value.size);

        ImGui.Text("PlainText: ");
        ImGui.InputTextMultiline('##source1', input.value, input.value.size, new ImGui.ImVec2(-1.0, ImGui.GetTextLineHeight() * 8), ImGui.ImGuiInputTextFlags.AllowTabInput);
        if (ImGui.Button("Encrypt")) {
            const rots = [ROTORS[rotor1_cur.value], ROTORS[rotor2_cur.value], ROTORS[rotor3_cur.value]];
            const rotknocks = [ROTOR_KNOCKS[rotor1_cur.value], ROTOR_KNOCKS[rotor2_cur.value], ROTOR_KNOCKS[rotor3_cur.value]];
            const reflector = REFLECTORS[reflector_cur.value];
            const plugboard = getPlugFromString(plugs.value.buffer);

            let engima = new Enigma({rotors: rots, knocks: rotknocks, plugs: plugboard, reflector: reflector, positions: [pos1.value.buffer, pos2.value.buffer, pos3.value.buffer]});
            output.value.buffer = engima.cipher(input.value.buffer);
        }
        ImGui.Text("CipherText: ");
        ImGui.InputTextMultiline('##source2', output.value, output.value.size, new ImGui.ImVec2(-1.0, ImGui.GetTextLineHeight() * 8), ImGui.ImGuiInputTextFlags.ReadOnly);

        ImGui.End();

        ImGui.EndFrame();

        ImGui.Render();
        const gl = ImGui_Impl.gl;
        gl && gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl && gl.clearColor(clear_color.x, clear_color.y, clear_color.z, clear_color.w);
        gl && gl.clear(gl.COLOR_BUFFER_BIT);
        //gl.useProgram(0); // You may want this if using this code in an OpenGL 3+ context where shaders may be bound

        ImGui_Impl.RenderDrawData(ImGui.GetDrawData());

        window.requestAnimationFrame(done ? _done : _loop);
    }

    function _done() {
        ImGui_Impl.Shutdown();
        ImGui.DestroyContext();
    }
});
