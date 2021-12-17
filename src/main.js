_static = {};

Static = class Static {
    constructor(value) {
        this.value = value;
    }
};

function STATIC(key, value) {
    return _static[key] || (_static[key] = new Static(value));
}

System.register(["imgui-js", "./imgui_impl.js", "./imgui_demo.js", "./imgui_memory_editor.js"], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var ImGui, ImGui_Impl, imgui_demo_js_1, imgui_memory_editor_js_1, font, show_demo_window, show_another_window, clear_color, memory_editor, show_sandbox_window, show_gamepad_window, show_movie_window, f, counter, done, source, image_urls, image_url, image_element, image_gl_texture, video_urls, video_url, video_element, video_gl_texture, video_w, video_h, video_time_active, video_time, video_duration;
    var __moduleName = context_1 && context_1.id;
    function LoadArrayBuffer(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url);
            return response.arrayBuffer();
        });
    }
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            yield ImGui.default();
            if (typeof (window) !== "undefined") {
                window.requestAnimationFrame(_init);
            }
            else {
                function _main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield _init();
                        for (let i = 0; i < 3; ++i) {
                            _loop(1 / 60);
                        }
                        yield _done();
                    });
                }
                _main().catch(console.error);
            }
        });
    }
    exports_1("default", main);
    function AddFontFromFileTTF(url, size_pixels, font_cfg = null, glyph_ranges = null) {
        return __awaiter(this, void 0, void 0, function* () {
            font_cfg = font_cfg || new ImGui.FontConfig();
            font_cfg.Name = font_cfg.Name || `${url.split(/[\\\/]/).pop()}, ${size_pixels.toFixed(0)}px`;
            return ImGui.GetIO().Fonts.AddFontFromMemoryTTF(yield LoadArrayBuffer(url), size_pixels, font_cfg, glyph_ranges);
        });
    }
    function _init() {
        return __awaiter(this, void 0, void 0, function* () {
            const EMSCRIPTEN_VERSION = `${ImGui.bind.__EMSCRIPTEN_major__}.${ImGui.bind.__EMSCRIPTEN_minor__}.${ImGui.bind.__EMSCRIPTEN_tiny__}`;
            console.log("Emscripten Version", EMSCRIPTEN_VERSION);
            console.log("Total allocated space (uordblks) @ _init:", ImGui.bind.mallinfo().uordblks);
            // Setup Dear ImGui context
            ImGui.CHECKVERSION();
            ImGui.CreateContext();
            const io = ImGui.GetIO();
            //io.ConfigFlags |= ImGui.ConfigFlags.NavEnableKeyboard;     // Enable Keyboard Controls
            //io.ConfigFlags |= ImGui.ConfigFlags.NavEnableGamepad;      // Enable Gamepad Controls
            // Setup Dear ImGui style
            ImGui.StyleColorsDark();
            //ImGui.StyleColorsClassic();
            // Load Fonts
            // - If no fonts are loaded, dear imgui will use the default font. You can also load multiple fonts and use ImGui::PushFont()/PopFont() to select them.
            // - AddFontFromFileTTF() will return the ImFont* so you can store it if you need to select the font among multiple.
            // - If the file cannot be loaded, the function will return NULL. Please handle those errors in your application (e.g. use an assertion, or display an error and quit).
            // - The fonts will be rasterized at a given size (w/ oversampling) and stored into a texture when calling ImFontAtlas::Build()/GetTexDataAsXXXX(), which ImGui_ImplXXXX_NewFrame below will call.
            // - Read 'docs/FONTS.md' for more instructions and details.
            // - Remember that in C/C++ if you want to include a backslash \ in a string literal you need to write a double backslash \\ !
            io.Fonts.AddFontDefault();
            // font = yield AddFontFromFileTTF("../imgui/misc/fonts/Roboto-Medium.ttf", 16.0);
            // font = await AddFontFromFileTTF("../imgui/misc/fonts/Cousine-Regular.ttf", 15.0);
            // font = await AddFontFromFileTTF("../imgui/misc/fonts/DroidSans.ttf", 16.0);
            // font = await AddFontFromFileTTF("../imgui/misc/fonts/ProggyTiny.ttf", 10.0);
            // font = await AddFontFromFileTTF("c:\\Windows\\Fonts\\ArialUni.ttf", 18.0, null, io.Fonts.GetGlyphRangesJapanese());
            // font = await AddFontFromFileTTF("https://raw.githubusercontent.com/googlei18n/noto-cjk/master/NotoSansJP-Regular.otf", 18.0, null, io.Fonts.GetGlyphRangesJapanese());
            // ImGui.ASSERT(font !== null);
            // Setup Platform/Renderer backends
            // ImGui_ImplSDL2_InitForOpenGL(window, gl_context);
            // ImGui_ImplOpenGL3_Init(glsl_version);
            if (typeof (window) !== "undefined") {
                const output = document.getElementById("output") || document.body;
                const canvas = document.createElement("canvas");
                output.appendChild(canvas);
                canvas.tabIndex = 1;
                canvas.style.position = "absolute";
                canvas.style.left = "0px";
                canvas.style.right = "0px";
                canvas.style.top = "0px";
                canvas.style.bottom = "0px";
                canvas.style.width = "100%";
                canvas.style.height = "100%";
                canvas.style.userSelect = "none";
                ImGui_Impl.Init(canvas);
            }
            else {
                ImGui_Impl.Init(null);
            }
            StartUpImage();
            StartUpVideo();
            if (typeof (window) !== "undefined") {
                window.requestAnimationFrame(_loop);
            }
        });
    }

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

    // Main loop
    function _loop(time) {
        ImGui_Impl.NewFrame(time);
        ImGui.NewFrame();


        // ImGui.SetNextWindowPos(new ImGui.ImVec2(20, 20), ImGui.Cond.FirstUseEver);
        // ImGui.Begin("Debug");
        // ImGui.Text(`Application average framerate ${(1000.0 / ImGui.GetIO().Framerate).toFixed(3)} ms/frame (${ImGui.GetIO().Framerate.toFixed(1)} FPS)`);
        // ImGui.End();
        
        // ImGui.SetNextWindowPos(new ImGui.ImVec2(20, 70), ImGui.Cond.FirstUseEver);
        // ImGui.SetNextWindowSize(new ImGui.ImVec2(900, 500), ImGui.Cond.FirstUseEver);

        {
        ImGui.Begin('Enigma Cracker');
        const intercepted = STATIC("intercepted", new ImGui.ImStringBuffer(1024 * 16, ''));

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

            intercepted.value.buffer = ''
            for (let i = 0; i < inter.length; i++) {
                intercepted.value.buffer += inter[i] + '\n';
            }
        }
        HelpMarker("Each transmission of Enigma needs to be on new line, ");
        ImGui.Text("Intercepted: ");
        ImGui.InputTextMultiline("##intercepted", intercepted.value, intercepted.value.size, new ImGui.ImVec2(-1.0, ImGui.GetTextLineHeight() *8));

        const prev_crack = STATIC("prev_crack", []);
        const plugs_to_try = STATIC("plugs_to_try", new ImGui.ImStringBuffer(64, ""));
        const decrypted = STATIC('decrypted', new ImGui.ImStringBuffer(1024 * 16, ''));
        const active_sig = STATIC("active_sig", {});

        if (ImGui.Button("Crack")) {
            const to_crack = intercepted.value.buffer.split('\n');
            if (to_crack[0].length > 6)  prev_crack.value = crack(to_crack);
        }
        ImGui.InputText("Plugboard", plugs_to_try.value, plugs_to_try.value.size);
        ImGui.SameLine();
        HelpMarker("Plugboard should be in the format key1:value1,key1:value1 where both have to be uppercase");

        if (prev_crack.value !== false) {
            HelpMarker("Starting from the top each drop down shows a possible setting that matched This assumes the reflector is UKW Beta");
            for (let i = 0; i < prev_crack.value.length; i++) {
                const cur = prev_crack.value[i];
                if (ImGui.TreeNode(cur.sig)) {
                    active_sig.value = cur;
                    ImGui.Columns(2, "Rotor Sim");
                    for (let pair = 0; pair < 3; pair++) {
                        const cur_pair = cur.base_pattern[pair];
                        for (let n = 0; n < cur_pair.length; n++) {
                            ImGui.PushID(n);
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

                            if (ImGui.BeginDragDropSource(ImGui.DragDropFlags.None)) {
                                ImGui.SetDragDropPayload(`CycleSwap_${pair}`, {n});
                                ImGui.Text(`Swap ${cur_pair[n]}`);
                                ImGui.EndDragDropSource();
                            }

                            if (ImGui.BeginDragDropTarget()) {
                                let payload;
                                if (payload = ImGui.AcceptDragDropPayload(`CycleSwap_${pair}`)) {
                                    const payload_n = payload.Data.n;
                                    const tmp = cur_pair[n];
                                    cur_pair[n] = cur_pair[payload_n];
                                    cur_pair[payload_n] = tmp;
                                }
                                ImGui.EndDragDropTarget();
                            }

                            ImGui.PopID();
                            ImGui.SameLine();
                        }
                        ImGui.NewLine();
                        ImGui.NextColumn();
                        const to_match = cur.pattern_to_match[pair];
                        for (let n = 0; n < to_match.length; n++) {
                            const rotation = STATIC(`rotate_string_${pair}_${n}_${cur.sig}`, 0);
                            let err_color = checkSetting(getPlugFromString(plugs_to_try.value.buffer), rotateStringRightNtimes(rotation.value, cur_pair[n]), to_match[n],) ? new ImGui.ImVec4(0.0, 1.0, 0.0, 1.0): new ImGui.ImVec4(1.0, 0.0, 0.0, 1.0);
                            ImGui.TextColored(err_color, to_match[n]);
                            ImGui.SameLine();
                        }
                        ImGui.Separator();
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
        
        if (ImGui.Button("Try Active Setting") && Object.keys(active_sig.value) != 0) {
            const rots = [active_sig.value.rots[0][0], active_sig.value.rots[1][0], active_sig.value.rots[2][0]];
            const knocks = [active_sig.value.rots[0][1], active_sig.value.rots[1][1], active_sig.value.rots[2][1]];
            decrypted.value.buffer = decryptMultiInEnigmaProtocol(rots, knocks, getPlugFromString(plugs_to_try.value.buffer), UKW_B, active_sig.value.pos, intercepted.value.buffer.split('\n'));
        }
        ImGui.Text("Decrypted: ");
        ImGui.InputTextMultiline('##decrypted', decrypted.value, decrypted.value.size, new ImGui.ImVec2(-1.0, ImGui.GetTextLineHeight() * 8), ImGui.ImGuiInputTextFlags.ReadOnly);

        ImGui.End();

        ImGui.SetNextWindowPos(new ImGui.ImVec2(940, 70), ImGui.Cond.FirstUseEver);
        ImGui.SetNextWindowSize(new ImGui.ImVec2(650, 500), ImGui.Cond.FirstUseEver);
        ImGui.Begin("Enigma Emulator");
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
        ImGui.SameLine();
        HelpMarker("Plugboard should be in the format key1:value1,key1:value1 where both have to be uppercase");

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
        }

        ImGui.EndFrame();

        ImGui.Render();
        const gl = ImGui_Impl.gl;
        gl && gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl && gl.clearColor(clear_color.x, clear_color.y, clear_color.z, clear_color.w);
        gl && gl.clear(gl.COLOR_BUFFER_BIT);
        //gl.useProgram(0); // You may want this if using this code in an OpenGL 3+ context where shaders may be bound
        const ctx = ImGui_Impl.ctx;
        if (ctx) {
            // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = `rgba(${clear_color.x * 0xff}, ${clear_color.y * 0xff}, ${clear_color.z * 0xff}, ${clear_color.w})`;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        UpdateVideo();
        ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
        if (typeof (window) !== "undefined") {
            window.requestAnimationFrame(done ? _done : _loop);
        }
    }
    function _done() {
        return __awaiter(this, void 0, void 0, function* () {
            const gl = ImGui_Impl.gl;
            if (gl) {
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.clearColor(clear_color.x, clear_color.y, clear_color.z, clear_color.w);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            const ctx = ImGui_Impl.ctx;
            if (ctx) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
            CleanUpImage();
            CleanUpVideo();
            // Cleanup
            ImGui_Impl.Shutdown();
            ImGui.DestroyContext();
            console.log("Total allocated space (uordblks) @ _done:", ImGui.bind.mallinfo().uordblks);
        });
    }
    function ShowHelpMarker(desc) {
        ImGui.TextDisabled("(?)");
        if (ImGui.IsItemHovered()) {
            ImGui.BeginTooltip();
            ImGui.PushTextWrapPos(ImGui.GetFontSize() * 35.0);
            ImGui.TextUnformatted(desc);
            ImGui.PopTextWrapPos();
            ImGui.EndTooltip();
        }
    }
    function ShowSandboxWindow(title, p_open = null) {
        ImGui.SetNextWindowSize(new ImGui.Vec2(320, 240), ImGui.Cond.FirstUseEver);
        ImGui.Begin(title, p_open);
        ImGui.Text("Source");
        ImGui.SameLine();
        ShowHelpMarker("Contents evaluated and appended to the window.");
        ImGui.PushItemWidth(-1);
        ImGui.InputTextMultiline("##source", (_ = source) => (source = _), 1024, ImGui.Vec2.ZERO, ImGui.InputTextFlags.AllowTabInput);
        ImGui.PopItemWidth();
        try {
            eval(source);
        }
        catch (e) {
            ImGui.TextColored(new ImGui.Vec4(1.0, 0.0, 0.0, 1.0), "error: ");
            ImGui.SameLine();
            ImGui.Text(e.message);
        }
        ImGui.End();
    }
    function ShowGamepadWindow(title, p_open = null) {
        ImGui.Begin(title, p_open, ImGui.WindowFlags.AlwaysAutoResize);
        const gamepads = (typeof (navigator) !== "undefined" && typeof (navigator.getGamepads) === "function") ? navigator.getGamepads() : [];
        if (gamepads.length > 0) {
            for (let i = 0; i < gamepads.length; ++i) {
                const gamepad = gamepads[i];
                ImGui.Text(`gamepad ${i} ${gamepad && gamepad.id}`);
                if (!gamepad) {
                    continue;
                }
                ImGui.Text(`       `);
                for (let button = 0; button < gamepad.buttons.length; ++button) {
                    ImGui.SameLine();
                    ImGui.Text(`${button.toString(16)}`);
                }
                ImGui.Text(`buttons`);
                for (let button = 0; button < gamepad.buttons.length; ++button) {
                    ImGui.SameLine();
                    ImGui.Text(`${gamepad.buttons[button].value}`);
                }
                ImGui.Text(`axes`);
                for (let axis = 0; axis < gamepad.axes.length; ++axis) {
                    ImGui.Text(`${axis}: ${gamepad.axes[axis].toFixed(2)}`);
                }
            }
        }
        else {
            ImGui.Text("connect a gamepad");
        }
        ImGui.End();
    }
    function StartUpImage() {
        if (typeof document !== "undefined") {
            image_element = document.createElement("img");
            image_element.crossOrigin = "anonymous";
            image_element.src = image_url;
        }
        const gl = ImGui_Impl.gl;
        if (gl) {
            const width = 256;
            const height = 256;
            const pixels = new Uint8Array(4 * width * height);
            image_gl_texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, image_gl_texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            if (image_element) {
                image_element.addEventListener("load", (event) => {
                    if (image_element) {
                        gl.bindTexture(gl.TEXTURE_2D, image_gl_texture);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image_element);
                    }
                });
            }
        }
        const ctx = ImGui_Impl.ctx;
        if (ctx) {
            image_gl_texture = image_element; // HACK
        }
    }
    function CleanUpImage() {
        const gl = ImGui_Impl.gl;
        if (gl) {
            gl.deleteTexture(image_gl_texture);
            image_gl_texture = null;
        }
        const ctx = ImGui_Impl.ctx;
        if (ctx) {
            image_gl_texture = null;
        }
        image_element = null;
    }
    function StartUpVideo() {
        if (typeof document !== "undefined") {
            video_element = document.createElement("video");
            video_element.crossOrigin = "anonymous";
            video_element.preload = "auto";
            video_element.src = video_url;
            video_element.load();
        }
        const gl = ImGui_Impl.gl;
        if (gl) {
            const width = 256;
            const height = 256;
            const pixels = new Uint8Array(4 * width * height);
            video_gl_texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, video_gl_texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        }
        const ctx = ImGui_Impl.ctx;
        if (ctx) {
            video_gl_texture = video_element; // HACK
        }
    }
    function CleanUpVideo() {
        const gl = ImGui_Impl.gl;
        if (gl) {
            gl.deleteTexture(video_gl_texture);
            video_gl_texture = null;
        }
        const ctx = ImGui_Impl.ctx;
        if (ctx) {
            video_gl_texture = null;
        }
        video_element = null;
    }
    function UpdateVideo() {
        const gl = ImGui_Impl.gl;
        if (gl && video_element && video_element.readyState >= video_element.HAVE_CURRENT_DATA) {
            gl.bindTexture(gl.TEXTURE_2D, video_gl_texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video_element);
        }
    }
    function ShowMovieWindow(title, p_open = null) {
        ImGui.Begin(title, p_open, ImGui.WindowFlags.AlwaysAutoResize);
        if (video_element !== null) {
            if (p_open && !p_open()) {
                video_element.pause();
            }
            const w = video_element.videoWidth;
            const h = video_element.videoHeight;
            if (w > 0) {
                video_w = w;
            }
            if (h > 0) {
                video_h = h;
            }
            ImGui.BeginGroup();
            if (ImGui.BeginCombo("##urls", null, ImGui.ComboFlags.NoPreview | ImGui.ComboFlags.PopupAlignLeft)) {
                for (let n = 0; n < ImGui.ARRAYSIZE(video_urls); n++) {
                    if (ImGui.Selectable(video_urls[n])) {
                        video_url = video_urls[n];
                        console.log(video_url);
                        video_element.src = video_url;
                        video_element.autoplay = true;
                    }
                }
                ImGui.EndCombo();
            }
            ImGui.SameLine();
            ImGui.PushItemWidth(video_w - 20);
            if (ImGui.InputText("##url", (value = video_url) => video_url = value)) {
                console.log(video_url);
                video_element.src = video_url;
            }
            ImGui.PopItemWidth();
            ImGui.EndGroup();
            if (ImGui.ImageButton(video_gl_texture, new ImGui.Vec2(video_w, video_h))) {
                if (video_element.readyState >= video_element.HAVE_CURRENT_DATA) {
                    video_element.paused ? video_element.play() : video_element.pause();
                }
            }
            ImGui.BeginGroup();
            if (ImGui.Button(video_element.paused ? "Play" : "Stop")) {
                if (video_element.readyState >= video_element.HAVE_CURRENT_DATA) {
                    video_element.paused ? video_element.play() : video_element.pause();
                }
            }
            ImGui.SameLine();
            if (!video_time_active) {
                video_time = video_element.currentTime;
                video_duration = video_element.duration || 0;
            }
            ImGui.SliderFloat("##time", (value = video_time) => video_time = value, 0, video_duration);
            const video_time_was_active = video_time_active;
            video_time_active = ImGui.IsItemActive();
            if (!video_time_active && video_time_was_active) {
                video_element.currentTime = video_time;
            }
            ImGui.EndGroup();
        }
        else {
            ImGui.Text("No Video Element");
        }
        ImGui.End();
    }
    return {
        setters: [
            function (ImGui_1) {
                ImGui = ImGui_1;
            },
            function (ImGui_Impl_1) {
                ImGui_Impl = ImGui_Impl_1;
            },
            function (imgui_demo_js_1_1) {
                imgui_demo_js_1 = imgui_demo_js_1_1;
            },
            function (imgui_memory_editor_js_1_1) {
                imgui_memory_editor_js_1 = imgui_memory_editor_js_1_1;
            }
        ],
        execute: function () {
            font = null;
            // Our state
            show_demo_window = true;
            show_another_window = false;
            clear_color = new ImGui.Vec4(0.45, 0.55, 0.60, 1.00);
            memory_editor = new imgui_memory_editor_js_1.MemoryEditor();
            memory_editor.Open = false;
            show_sandbox_window = false;
            show_gamepad_window = false;
            show_movie_window = false;
            /* static */ f = 0.0;
            /* static */ counter = 0;
            done = false;
            source = [
                "ImGui.Text(\"Hello, world!\");",
                "ImGui.SliderFloat(\"float\",",
                "\t(value = f) => f = value,",
                "\t0.0, 1.0);",
                "",
            ].join("\n");
            image_urls = [
                "https://threejs.org/examples/textures/crate.gif",
                "https://threejs.org/examples/textures/sprite.png",
                "https://threejs.org/examples/textures/uv_grid_opengl.jpg",
            ];
            image_url = image_urls[0];
            image_element = null;
            image_gl_texture = null;
            video_urls = [
                "https://threejs.org/examples/textures/sintel.ogv",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
            ];
            video_url = video_urls[0];
            video_element = null;
            video_gl_texture = null;
            video_w = 640;
            video_h = 360;
            video_time_active = false;
            video_time = 0;
            video_duration = 0;
        }
    };
});
//# sourceMappingURL=main.js.map