window.onload = function()
{
    document.onkeydown = function(e)
    {
        if(e.code === 'F12')
        {
            return false;
        }
        else if(e.ctrlKey && e.code === 'KeyU')
        {
            return false;
        }
        else if(e.shiftKey && e.code === 'F10')
        {
            return false;
        }
        else if(e.ctrlKey && e.shiftKey && e.code === 'KeyI')
        {
            return false;
        }

        if(e.altKey && e.code === 'KeyO')
        {
            e.preventDefault();
            browse.click();
        }
    }
    document.oncontextmenu = function()
    {
        return false;
    }

    showHistory();
    showSites();
}


let picture = document.querySelector('.wallpaper div'),
    searchBox = document.querySelector('.searchBox'),
    site = document.querySelector('.site'),
    form = document.querySelector('.form'),
    search = document.querySelector('.search'),
    switchBtn = document.querySelector('.switchBtn'),
    suggestion = document.querySelector('.suggestion'),
    clearHistory = document.querySelector('.clearHistory'),
    engines = document.querySelector('.engines'),
    baidu = document.querySelector('.baidu'),
    google = document.querySelector('.google'),
    customEngine = document.querySelector('.customEngine'),
    searchHistory = document.querySelector('.searchHistory'),
    wallpaperBtn = document.querySelector('.wallpaperBtn'),
    setDrag = document.querySelector('.setDrag'),
    login = document.querySelector('.login'),
    websiteBox = document.querySelector('.websiteBox'),
    clock = document.querySelector('.clock'),
    website = document.querySelector('.website'),
    add = document.querySelector('.add'),
    popup = document.querySelector('.popup'),
    caption = document.querySelector('.caption'),
    off = document.querySelector('.off'),
    name = document.querySelector('.name'),
    email = document.querySelector('.email'),
    code_1 = document.querySelector('.code_1'),
    show_1 = document.querySelector('.show_1'),
    code_2 = document.querySelector('.code_2'),
    show_2 = document.querySelector('.show_2'),
    captcha = document.querySelector('.captcha'),
    captchaBtn = document.querySelector('.captchaBtn'),
    title = document.querySelector('.title'),
    link = document.querySelector('.link'),
    address = document.querySelector('.address'),
    icon = document.querySelector('.icon'),
    button = document.querySelector('.popup button:nth-child(12)'),
    drag = document.querySelector('.drag'),
    browseBtn = document.querySelector('.browseBtn'),
    browse = document.querySelector('.browse'),
    clear = document.querySelector('.clear'),
    left = document.querySelector('.left'),
    right = document.querySelector('.right'),
    cut_copy_paste = document.querySelector('.cut_copy_paste'),
    cut = document.querySelector('.cut'),
    copy = document.querySelector('.copy'),
    paste = document.querySelector('.paste'),
    edit_del = document.querySelector('.edit_del'),
    edit = document.querySelector('.edit'),
    del = document.querySelector('.del'),
    tipsPopup = document.querySelector('.tipsPopup'),
    tipsOff = document.querySelector('.tipsPopup .off'),
    text = document.querySelector('.tipsPopup span:nth-child(3)'),
    seal = document.querySelector('.seal'),
    cancel = document.querySelector('.cancel');

let input = document.querySelectorAll('input[mo="mo"]'),
    empty = document.querySelectorAll('.empty'),
    tips = document.querySelectorAll('.tips')
    span = document.querySelectorAll('.engines span'),
    box = document.querySelectorAll('.box');

let user = JSON.parse(localStorage.getItem('user')),
    engine = localStorage.getItem('engine');


site.onclick = function()
{
    Object.assign(searchBox.style, {opacity: '0', pointerEvents: 'none'});
    Object.assign(websiteBox.style, {opacity: '1', pointerEvents: 'unset'});
}
clock.onclick = function()
{
    Object.assign(searchBox.style, {opacity: '1', pointerEvents: 'unset'});
    searchFocus();
    Object.assign(websiteBox.style, {opacity: '0', pointerEvents: 'none'});
}
switchBtn.onclick = function()
{
    engines.classList.toggle('engines_show');
    switchBtn.classList.toggle('switchBtn_deg');

    searchFocus();
    clearTimer();
}
function searchFocus()
{
    search.focus();
}


search.onkeyup = function(e)
{
    if(e.ctrlKey && e.keyCode === 86)
    {
        takeLink();
    }

    if(!search.value.trim() && e.keyCode === 8 || e.ctrlKey && e.keyCode === 88)
    {
        clearSuggestion();
        return false;
    }
    else if(search.value.trim() && e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13 && e.keyCode !== 27)
    {
        suggestions();
    }
}
let tag = -1;
search.onkeydown = function(e)
{
    if(e.altKey && e.keyCode === 13 && document.querySelector('.suggestion p, .suggestion b'))
    {
        search.value = document.querySelector('.suggestion p, .suggestion b').innerText;
        translate_visit();
        return false;
    }
    else if(e.keyCode === 13)
    {
        e.preventDefault();
        if(tag === 0 && suggestion.children[tag].matches('.suggestion p') || tag === 0 && suggestion.children[tag].matches('.suggestion b'))
        {
            translate_visit();
        }
        else
        {
            history_search();
        }
        return false;
    }
    else if(e.keyCode === 38)
    {
        e.preventDefault();
        if(suggestion.children.length === 0) return false;
        if(tag === -1)
        {
            tag = suggestion.children.length - 1;
        }
        else
        {
            suggestion.children[tag].className = '';
            tag -= 1;
        }

        if(tag < 0)
        {
            tag = suggestion.children.length - 1;
        }
        suggestion.children[tag].className = 'focus';
        search.value = suggestion.children[tag].innerText;
        return false;
    }
    else if(e.keyCode === 40)
    {
        e.preventDefault();
        if(suggestion.children.length === 0) return false;
        if(tag === -1)
        {
            tag = 0;
        }
        else
        {
            suggestion.children[tag].className = '';
            tag++;
        }

        if(tag >= suggestion.children.length)
        {
            tag = 0;
        }
        suggestion.children[tag].className = 'focus';
        search.value = suggestion.children[tag].innerText;
        return false;
    }
    else if(e.keyCode === 27)
    {
        clearSuggestion();
        return false;
    }
    else if(e.altKey && e.keyCode === 46)
    {
        localStorage.removeItem('history');
        clearSuggestion();
        return false;
    }
    else if(e.altKey && e.keyCode === 49)
    {
        baidu.click();
        return false;
    }
    else if(e.altKey && e.keyCode === 50)
    {
        google.click();
        return false;
    }
    else if(e.altKey && e.keyCode === 51)
    {
        customEngine.click();
        return false;
    }
    else if(e.altKey && e.keyCode === 52)
    {
        searchHistory.click();
        return false;
    }
}
form.onclick = function(e)
{
    if(tag === 0 && suggestion.children[tag].matches('.suggestion p') && e.target.matches('.btn') || tag === 0 && suggestion.children[tag].matches('.suggestion b') && e.target.matches('.btn'))
    {
        translate_visit();
    }
    else
    {
        if(e.target.matches('.empty'))
        {
            search.value = '';
            searchFocus();
            clearSuggestion();
        }
        else if(e.target.matches('.btn'))
        {
            history_search();
        }
        else if(e.target.matches('.suggestion p'))
        {
            search.value = e.target.innerText;
            translate_visit();
        }
        else if(e.target.matches('.suggestion b'))
        {
            search.value = e.target.innerText;
            translate_visit();
        }
        else if(e.target.matches('.suggestion em'))
        {
            search.value = e.target.innerText;
            history_search();
        }
        else if(e.target.matches('.clearHistory'))
        {
            localStorage.removeItem('history');
            clearSuggestion();
        }
    }
}
search.onclick = function()
{
    if(search.value === '')
    {
        showHistory();
    }
}
let timer = null;
search.onblur = function()
{
    timer = setTimeout(()=>{clearSuggestion()}, 300);
}
searchHistory.onclick = function()
{
    if(searchHistory.classList.contains('searchHistory'))
    {
        searchHistory.className = 'history_size';
        localStorage.setItem('class', 'history_size');

        clearTimer();
    }
    else if(searchHistory.classList.contains('history_size'))
    {
        searchHistory.className = 'searchHistory';
        localStorage.setItem('class', 'searchHistory');

        clearSuggestion();
    }

    searchFocus();
}
suggestion.onclick = function(e)
{
    if(e.target.matches('.suggestion em button'))
    {
        let history = JSON.parse(localStorage.getItem('history'));

        history.splice(e.target.getAttribute('unique'), 1);
        localStorage.setItem('history', JSON.stringify(history));

        if(history.length === 0)
        {
            form.style.height = '40px';
            clearHistory.textContent = '';
        }

        showHistory();
        clearTimer();
    }
}
searchHistory.className = localStorage.getItem('class') || 'searchHistory';

function takeLink()
{
    if(search.value.match(/.*http[s]{0,1}.*|.*http[s]{0,1}|http[s]{0,1}.*/))
    {
        search.value = search.value.match(https);
        search.value = search.value.replace(/[, ].*/g, '');
    }
}
function clearSuggestion()
{
    form.style.height = '40px';
    tag = -1;
    suggestion.innerHTML = '';
    clearHistory.textContent = '';
}
function suggestions()
{
    $.ajax(
            {
                type: 'POST',
                url: 'suggestion.php',
                data: {
                        action: 'search',
                        wd: search.value
                      },
                dataType: 'json',
                success: function(res)
                {
                    clearSuggestion();

                    if(!search.value.trim()) return false;
                    let p = document.createElement('p'),
                        b = document.createElement('b');
                        p.textContent = search.value;
                        b.textContent = search.value;
                    if(!search.value.match(https))
                    {
                        suggestion.appendChild(p);
                    }
                    else
                    {
                        suggestion.appendChild(b);
                    }
                    if(res.data.suggestions.length > 0)
                    {
                        for(let i = 0; i < res.data.suggestions.length; i++)
                        {
                            let em = document.createElement('em');
                                em.textContent = res.data.suggestions[i];
                            suggestion.appendChild(em);
                        }

                        suggestion.setAttribute('render', 'suggestion');
                    }

                    let sum = 0;
                    if(suggestion.children.length === 1)
                    {
                        sum = suggestion.children.length * 34 + 40;
                    }
                    else
                    {
                        sum = res.data.suggestions.length * 34 + 40 + 34;
                    }
                    form.style.height = `${sum}px`;
                }
            }
          )
}
function translate_visit()
{
    if(!search.value.trim()) return false;
    if(!search.value.match(https))
    {
        window.open('https://fanyi.baidu.com/#zh/en/' + search.value, '_blank');
    }
    else
    {
        window.open(search.value, '_blank');
    }
    clearSuggestion();
}
function history_search()
{
    let engine = localStorage.getItem('engine');
    if(!search.value.trim() || search.value.match(https)) return false;
    if(searchHistory.classList.contains('history_size'))
    {
        let history = JSON.parse(localStorage.getItem('history') || '[]');

        if(history.includes(search.value))
        {
            history.splice(history.indexOf(search.value), 1);
        }
        if(history.length >= 10)
        {
            history.pop();
        }

        history.unshift(search.value);
        localStorage.setItem('history', JSON.stringify(history));

        showHistory();
    }
    if(engine)
    {
        window.open(engine + encodeURIComponent(search.value), '_blank');
    }
    clearSuggestion();
}
function showHistory()
{
    if(searchHistory.classList.contains('history_size'))
    {
        let history = JSON.parse(localStorage.getItem('history') || '[]');

        suggestion.innerHTML = '';
        if(history.length > 0)
        {
            for(let i = 0; i < history.length; i++)
            {
                let em = document.createElement('em'),
                    del = document.createElement('button');
                    em.textContent = history[i];
                    del.setAttribute('unique', i);
                em.appendChild(del);
                suggestion.appendChild(em);
            }

            suggestion.setAttribute('render', 'history');

            let sum = history.length * 34 + 40 + 34;
            form.style.height = `${sum}px`;
            clearHistory.textContent = '清除历史记录';
        }

        tag = -1;
    }
}
function clearTimer()
{
    clearTimeout(timer);
}


baidu.onclick = function()
{
    searchFocus();
    clearSize();
    baidu.classList.add('size');

    let engine = 'https://www.baidu.com/s?wd=';
    engineData(engine);

    clearTimer();
}
google.onclick = function()
{
    searchFocus();
    clearSize();
    google.classList.add('size');

    let engine = 'https://www.google.com/search?q=';
    engineData(engine);

    clearTimer();
}
customEngine.onclick = function()
{
    let engine = localStorage.getItem('engine');
    popup.setAttribute('action', 'engine');
    openPopup([8]);
    address.placeholder = '引擎';
    if(engine !== 'https://www.baidu.com/s?wd=' && engine !== 'https://www.google.com/search?q=')
    {
        address.value = engine;
    }

    clearTimer();
}
document.onvisibilitychange = function()
{
    let engine = localStorage.getItem('engine');
    if(!engine)
    {
        window.location.reload();
    }
}
if(engine)
{
    showEngine();
}
else
{
    restoreEngine();
}

function clearSize()
{
    for(let i = 0; i < span.length; i++)
    {
        span[i].classList.remove('size');
    }
}
function engineData(engine)
{
    let user = JSON.parse(localStorage.getItem('user'));
    if(!user)
    {
        localStorage.setItem('engine', engine);
    }
    else
    {
        $.ajax(
                {
                    type: 'POST',
                    url: 'api.php',
                    data: {
                            action: 'engine',
                            email: user.email,
                            token: user.token,
                            engine: engine
                          },
                    dataType: 'json',
                    success: function(res)
                    {
                        if(res.info)
                        {
                            openTips();
                            text.textContent = res.info;
                            hideSeal();
                            return false;
                        }
                        else
                        {
                            let engine = res.data.engine;
                            localStorage.setItem('engine', engine);
                        }
                    }
                }
              )
    }
}
function showEngine()
{
    let engine = localStorage.getItem('engine');
    if(engine === 'https://www.baidu.com/s?wd=')
    {
        clearSize();
        baidu.classList.add('size');
    }
    else if(engine === 'https://www.google.com/search?q=')
    {
        clearSize();
        google.classList.add('size');
    }
    else
    {
        clearSize();
        customEngine.classList.add('size');
    }
}
function restoreEngine()
{
    searchFocus();
    clearSize();
    baidu.classList.add('size');

    let engine = 'https://www.baidu.com/s?wd=';
    engineData(engine);
}


let wallpapers = indexedDB.open('wallpapers'), db;
wallpapers.onupgradeneeded = function()
{
    db = wallpapers.result;
    db.createObjectStore('wallpapers', {keyPath: 'wallpaper'});
}
wallpaperBtn.onclick = function()
{
    popup.setAttribute('action', 'wallpaper');
    openPopup();
}
drag.ondragover = function(e)
{
    e.preventDefault();
}
drag.ondrop = function(e)
{
    e.preventDefault();
    let wallpaper = e.dataTransfer.files[0];
    upload(wallpaper);
}
browseBtn.onclick = function()
{
    browse.click();
}
browse.onchange = function()
{
    let wallpaper = browse.files[0];
    upload(wallpaper);
    browse.value = '';
}
clear.onclick = function()
{
    let user = JSON.parse(localStorage.getItem('user'));
    if(!user)
    {
        db = wallpapers.result;
        db.transaction(['wallpapers'], 'readwrite')
          .objectStore('wallpapers')
          .delete('wallpaper');
        picture.style.backgroundImage = '';
    }
    else
    {
        $.ajax(
                {
                    type: 'POST',
                    url: 'api.php',
                    data: {
                            action: 'clear',
                            email: user.email,
                            token: user.token
                          },
                    dataType: 'json',
                    success: function(res)
                    {
                        if(res.info)
                        {
                            openTips();
                            text.textContent = res.info;
                            hideSeal();
                            return false;
                        }
                        else
                        {
                            localStorage.removeItem('wallpaper');
                            picture.style.backgroundImage = '';
                        }
                    }
                }
              )
    }

    offPopup();
}
if(!user)
{
    wallpapers.onsuccess = function()
    {
        db = wallpapers.result;
        let sql = db.transaction('wallpapers')
                    .objectStore('wallpapers')
                    .get('wallpaper');
        sql.onsuccess = function()
        {
            if(sql.result)
            {
                let blob = sql.result.blob;
                    blob = URL.createObjectURL(blob);
                picture.style.backgroundImage = `url(${blob})`;
            }
        }
    }
}
else
{
    showWallpaper();
}

let size = 14 * 1024 * 1024,
    fileReader = new FileReader();
function upload(wallpaper)
{
    if(!/image\/\w/.test(wallpaper.type))
    {
        openTips();
        text.textContent = '请确保文件为图片类型！';
        hideSeal();
        return false;
    }
    if(wallpaper.size > size)
    {
        openTips();
        text.textContent = '请选择14MB以内的图片！';
        hideSeal();
        return false;
    }

    let user = JSON.parse(localStorage.getItem('user'));
    if(!user)
    {
        fileReader.readAsArrayBuffer(wallpaper);
        fileReader.onload = function()
        {
            let blob = new Blob([new Uint8Array(fileReader.result)], {type: wallpaper.type});
            db = wallpapers.result;
            db.transaction(['wallpapers'], 'readwrite')
              .objectStore('wallpapers')
              .put({wallpaper: 'wallpaper', blob: blob});

            blob = URL.createObjectURL(blob);
            picture.style.backgroundImage = `url(${blob})`;
        }
    }
    else
    {
        fileReader.readAsDataURL(wallpaper);
        fileReader.onload = function()
        {
            let suffix = wallpaper.name.split('.').pop();
            $.ajax(
                    {
                        type: 'POST',
                        url: 'api.php',
                        data: {
                                action: 'wallpaper',
                                email: user.email,
                                token: user.token,
                                wallpaper: fileReader.result,
                                suffix: suffix
                              },
                        dataType: 'json',
                        success: function(res)
                        {
                            if(res.info)
                            {
                                openTips();
                                text.textContent = res.info;
                                hideSeal();
                                return false;
                            }
                            else
                            {
                                let wallpaper = res.data.wallpaper;
                                localStorage.setItem('wallpaper', wallpaper);
                                showWallpaper();
                            }
                        }
                    }
                  )
        }
    }
}
function showWallpaper()
{
    let wallpaper = localStorage.getItem('wallpaper');
    if(wallpaper)
    {
        picture.style.backgroundImage = `url(${wallpaper})`;
    }
}


setInterval(()=>{
                    if(picture.style.backgroundImage !== '')
                    {
                        clock.style.color = 'white';
                        $('.website span').css({'color': 'white'});
                    }
                    else
                    {
                        clock.style.color = 'black';
                        $('.website span').css({'color': 'black'});
                    }

                    let date = new Date(),
                        h = date.getHours(),
                        m = date.getMinutes();
                    h = h < 10 ? `0${h}` : h;
                    m = m < 10 ? `0${m}` : m;
                    clock.textContent = `${h}:${m}`;
                }
           )


login.onclick = function()
{
    let user = JSON.parse(localStorage.getItem('user'));
    if(!user)
    {
        popup.setAttribute('action', 'login');
        openPopup([2, 3]);
    }
    else
    {
        popup.setAttribute('action', 'messages');
        openPopup([1, 2]);
        caption.textContent = user.name;
        name.value = user.name;
        email.value = user.email;
    }
}
add.onclick = function()
{
    let user = JSON.parse(localStorage.getItem('user'));
    if(!user)
    {
        popup.setAttribute('action', 'login');
        openPopup([2, 3]);
    }
    else
    {
        popup.setAttribute('action', 'add');
        openPopup([6, 7, 8]);
        caption.textContent = '添加';
        address.placeholder = '图标';
        button.textContent = '添加';
    }
}
popup.onclick = function()
{
    if(popup.getAttribute('action') === 'engine')
    {
        clearTimer();
    }
}
off.onclick = function()
{
    offPopup();
}
for(let i = 1; i < input.length; i++)
{
    input[i].onkeydown = function(e)
    {
        if(e.keyCode === 13 && popup.getAttribute('action') !== 'messages' && input[i].getAttribute('action') === 'active')
        {
            e.preventDefault();
            if(valid(i))
            {
                inputFocus(i);
            }
            button.click();
        }
    }
    input[i].onkeyup = function(e)
    {
        if(i === 7 && e.ctrlKey && e.keyCode === 86)
        {
            link.blur();
        }
        else if(i === 8 && popup.getAttribute('action') === 'add' && e.ctrlKey && e.keyCode === 86)
        {
            address.blur();
        }
    }
}
link.onchange = function()
{
    setTimeout(()=>{TitleIcon()}, 300);
}
address.onchange = function()
{
    setTimeout(()=>{showIcon()}, 300);
}
address.oninput = function()
{
    if(popup.getAttribute('action') === 'add' && address.value === '')
    {
        clearIcon();
    }
}
for(let i = 1; i < empty.length; i++)
{
    empty[i].onclick = function()
    {
        input[i].value = '';
        input[i].focus();
        if(i === 8 && popup.getAttribute('action') === 'add' && address.value === '')
        {
            clearIcon();
        }
    }
}
show_1.onclick = function()
{
    if(code_1.type === 'password')
    {
        code_1.setAttribute('type', 'text');
        code_1.setSelectionRange(code_1.value.length, code_1.value.length);
        show_1.classList.add('hide');
        code_1.focus();
    }
    else
    {
        code_1.setAttribute('type', 'password');
        show_1.classList.remove('hide');
    }
}
show_2.onclick = function()
{
    if(code_2.type === 'password')
    {
        code_2.setAttribute('type', 'text');
        code_2.setSelectionRange(code_2.value.length, code_2.value.length);
        show_2.classList.add('hide');
        code_2.focus();
    }
    else
    {
        code_2.setAttribute('type', 'password');
        show_2.classList.remove('hide');
    }
}
captchaBtn.onclick = function()
{
    if(valid(2))
    {
        let s = 60;
        captchaBtn.style.cursor = 'no-drop';
        captchaBtn.disabled = true;
        let timer = setInterval(()=>{
                                        if(s === 0)
                                        {
                                            clearInterval(timer);
                                            captchaBtn.textContent = '发送验证码';
                                            captchaBtn.style.cursor = 'pointer';
                                            captchaBtn.disabled = false;
                                            s = 60;
                                        }
                                        else
                                        {
                                            captchaBtn.textContent = `${s}秒后重试`;
                                            s--;
                                        }
                                    }, 1000
                               )

        $.ajax(
                {
                    type: 'POST',
                    url: 'api.php',
                    data: {
                            action: 'captcha',
                            email: email.value
                          },
                    dataType: 'json',
                    success: function(res)
                    {
                        if(res.info)
                        {
                            openTips();
                            text.textContent = res.info;
                            hideSeal();
                            return false;
                        }
                    }
                }
              )
    }
}
button.onclick = function()
{
    if(!validAll())
    {
        for(let i = 1; i < input.length; i++)
        {
            if(input[i].getAttribute('action') === 'active')
            {
                valid(i);
            }
        }
    }
    else
    {
        let user = JSON.parse(localStorage.getItem('user')),
            engine = localStorage.getItem('engine');
        if(popup.getAttribute('action') === 'login')
        {
            clear.click();
            $.ajax(
                    {
                        type: 'POST',
                        url: 'api.php',
                        data: {
                                action: 'login',
                                email: email.value,
                                password: code_1.value
                              },
                        dataType: 'json',
                        success: function(res)
                        {
                            if(res.info)
                            {
                                openTips();
                                text.textContent = res.info;
                                hideSeal();
                                return false;
                            }
                            else
                            {
                                let user = res.data.user,
                                    engine = res.data.engine,
                                    wallpaper = res.data.wallpaper,
                                    sites = res.data.sites;
                                showData(user, engine, wallpaper, sites);
                            }
                        }
                    }
                  )
        }
        else if(popup.getAttribute('action') === 'password')
        {
            clear.click();
            $.ajax(
                    {
                        type: 'POST',
                        url: 'api.php',
                        data: {
                                action: 'password',
                                email: email.value,
                                password: code_1.value,
                                captcha: captcha.value
                              },
                        dataType: 'json',
                        success: function(res)
                        {
                            if(res.info)
                            {
                                openTips();
                                text.textContent = res.info;
                                hideSeal();
                                return false;
                            }
                            else
                            {
                                let user = res.data.user,
                                    engine = res.data.engine,
                                    wallpaper = res.data.wallpaper,
                                    sites = res.data.sites;
                                showData(user, engine, wallpaper, sites);
                            }
                        }
                    }
                  )
        }
        else if(popup.getAttribute('action') === 'register')
        {
            clear.click();
            $.ajax(
                    {
                        type: 'POST',
                        url: 'api.php',
                        data: {
                                action: 'register',
                                name: name.value,
                                email: email.value,
                                password: code_1.value,
                                engine: engine
                              },
                        dataType: 'json',
                        success: function(res)
                        {
                            if(res.info)
                            {
                                openTips();
                                text.textContent = res.info;
                                hideSeal();
                                return false;
                            }
                            else
                            {
                                let user = res.data.user;
                                localStorage.setItem('user', JSON.stringify(user));
                            }
                        }
                    }
                  )
        }
        else if(popup.getAttribute('action') === 'messages')
        {
            tips[2].textContent = '';
            if(code_1.value !== '' && code_1.value.length < 6)
            {
                tips[2].textContent = '密码长度不能小于6位！';
                return false;
            }
            else if(code_1.value !== '' && !code_1.value.match(/^[A-Za-z0-9]*$/))
            {
                tips[2].textContent = '请输入英文或数字类型的密码！';
                return false;
            }

            $.ajax(
                    {
                        type: 'POST',
                        url: 'api.php',
                        data: {
                                action: 'messages',
                                newName: name.value,
                                newEmail: email.value,
                                newPassword: code_1.value,
                                oldEmail: user.email,
                                oldToken: user.token
                              },
                        dataType: 'json',
                        success: function(res)
                        {
                            if(res.info)
                            {
                                openTips();
                                text.textContent = res.info;
                                hideSeal();
                                return false;
                            }
                            else
                            {
                                let user = res.data.user;
                                localStorage.setItem('user', JSON.stringify(user));
                            }
                        }
                    }
                  )
        }
        else if(popup.getAttribute('action') === 'engine')
        {
            searchFocus();
            clearSize();
            customEngine.classList.add('size');

            let engine = address.value;
            engineData(engine);
        }
        else if(popup.getAttribute('action') === 'add')
        {
            $.ajax(
                    {
                        type: 'POST',
                        url: 'api.php',
                        data: {
                                action: 'add',
                                email: user.email,
                                token: user.token,
                                unique: popup.getAttribute('unique'),
                                title: title.value,
                                link: link.value,
                                icon: icon.type === 'image' ? icon.src : icon.value,
                                attr: icon.type === 'image' ? 'image' : 'text',
                                color: icon.type === 'text' ? icon.getAttribute('color') : ''
                              },
                        dataType: 'json',
                        success: function(res)
                        {
                            if(res.info)
                            {
                                openTips();
                                text.textContent = res.info;
                                hideSeal();
                                return false;
                            }
                            else
                            {
                                let sites = res.data.sites;
                                localStorage.setItem('sites', JSON.stringify(sites));
                                showSites();
                            }
                        }
                    }
                  )
        }

        offPopup();
    }
}
left.onclick = function()
{
    if(popup.getAttribute('action') === 'login' || popup.getAttribute('action') === 'register')
    {
        popup.setAttribute('action', 'password');
        openPopup([2, 3, 4, 5]);
    }
    else if(popup.getAttribute('action') === 'password')
    {
        popup.setAttribute('action', 'login');
        openPopup([2, 3]);
    }
    else if(popup.getAttribute('action') === 'messages')
    {
        clearAll();
        offPopup();
    }
}
right.onclick = function()
{
    if(popup.getAttribute('action') === 'login' || popup.getAttribute('action') === 'password')
    {
        popup.setAttribute('action', 'register');
        openPopup([1, 2, 3, 4]);
    }
    else if(popup.getAttribute('action') === 'register')
    {
        popup.setAttribute('action', 'login');
        openPopup([2, 3]);
    }
    else if(popup.getAttribute('action') === 'messages')
    {
        openTips();
        text.textContent = '您确定要注销此账号吗？';
        seal.style.display = 'block';
        seal.style.width = '48%';
        cancel.style.width = '48%';
        cancel.textContent = '取消';
    }
}

function openPopup(active)
{
    popup.removeAttribute('unique');
    popup.style.opacity = '1';
    popup.style.transform = 'scale(1)';
    caption.textContent = '';
    for(let i = 1; i < input.length; i++)
    {
        input[i].removeAttribute('action');
        if(active)
        {
            if(active.includes(i))
            {
                input[i].setAttribute('action', 'active');
            }
        }
        input[i].value = '';
        tips[i - 1].textContent = '';
    }
    clearIcon();
    button.textContent = '';
}
function clearIcon()
{
    if(icon.type === 'image')
    {
        icon.src = '';
        icon.removeAttribute('src');
    }
    else if(icon.type === 'text')
    {
        icon.value = '';
        icon.removeAttribute('value');
        icon.removeAttribute('style');
        icon.removeAttribute('color');
    }
}
function offPopup()
{
    popup.style.opacity = '0';
    popup.style.transform = 'scale(0)';
    popup.style.transitionProperty = 'opacity, transform';
    popup.style.transitionDuration = '.5s';

    if(popup.getAttribute('action') === 'engine')
    {
        searchFocus();
    }
}
function valid(active)
{
    let Input = input[active],
        Text = Input.placeholder,
        Tips = tips[active - 1];
    Tips.textContent = '';

    if(Input.value === '')
    {
        Tips.textContent = `请输入${Text}！`;
        return false;
    }
    else if(active === 1 && !name.value.match(/^[A-Za-z0-9\u4e00-\u9fa5]+$/))
    {
        Tips.textContent = `请输入中、英文或数字类型的${Text}！`;
        return false;
    }
    else if(active === 2 && !email.value.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/) || active === 7 && !link.value.match(https) || popup.getAttribute('action') === 'engine' && active === 8 && !address.value.match(https))
    {
        Tips.textContent = `请输入有效的${Text}！`;
        return false;
    }
    else if(active === 3 && code_1.value.length < 6 || active === 5 && captcha.value.length < 6)
    {
        Tips.textContent = `${Text}长度不能小于6位！`;
        return false;
    }
    else if(active === 3 && !code_1.value.match(/^[A-Za-z0-9]*$/))
    {
        Tips.textContent = `请输入英文或数字类型的${Text}！`;
        return false;
    }
    else if(active === 4 && code_2.value !== code_1.value)
    {
        Tips.textContent = `输入两次密码不一致！`;
        return false;
    }
    else if(active === 5 && !captcha.value.match(/^[0-9]*$/))
    {
        Tips.textContent = `请输入数字类型的${Text}！`;
        return false;
    }
    else
    {
        return true;
    }
}
function inputFocus(active)
{
    for(let i = (active + 1) % input.length; i !== active; i = (i + 1) % input.length)
    {
        if(input[i].getAttribute('action') === 'active')
        {
            input[i].focus();
            break;
        }
    }
}
function TitleIcon()
{
    if(link.value !== '' && link.value.match(https))
    {
        link.value = link.value.replace(/\/$/, '');
        let domainName = link.value.match(domain[0]),
            titleName = link.value.match(domain[1]);
        if(domainName === null || titleName === null) return false;

        $.ajax(
                {
                    type: 'POST',
                    url: 'api.php',
                    data: {
                            action: 'TitleIcon',
                            link: link.value
                          },
                    dataType: 'json',
                    success: function(res)
                    {
                        if(title.value === '')
                        {
                            if(res.data.title === null)
                            {
                                title.value = titleName[2];
                                let uppercase = title.value.substring(0, 1).toUpperCase();
                                title.value = `${uppercase + title.value.substring(1, title.value.length)}`;
                            }
                            else
                            {
                                title.value = res.data.title;
                            }
                        }
                        if(address.value === '')
                        {
                            if(res.data.icon === null)
                            {
                                address.value = `${domainName[0]}/favicon.ico`;
                                icon.setAttribute('type', 'image');
                                icon.src = `${domainName[0]}/favicon.ico`;
                            }
                            else if(res.data.icon.match(https))
                            {
                                address.value = res.data.icon;
                                icon.setAttribute('type', 'image');
                                icon.src = res.data.icon;
                            }
                            else if(res.data.icon.match(backslash[0]))
                            {
                                address.value = `${domainName[0] + res.data.icon}`;
                                icon.setAttribute('type', 'image');
                                icon.src = `${domainName[0] + res.data.icon}`;
                            }
                            else if(res.data.icon.match(backslash[1]))
                            {
                                address.value = `${link.value.replace(backslash[2], '') + res.data.icon}`;
                                icon.setAttribute('type', 'image');
                                icon.src = `${link.value.replace(backslash[2], '') + res.data.icon}`;
                            }
                            else if(!res.data.icon.match(backslash[0]) || !res.data.icon.match(backslash[1]))
                            {
                                address.value = `${domainName[0] + '/' + res.data.icon}`;
                                icon.setAttribute('type', 'image');
                                icon.src = `${domainName[0] + '/' + res.data.icon}`;
                            }
                        }
                        clearTips();
                    },
                    error: function()
                    {
                        if(title.value === '' && address.value === '' || title.value === '' && address.value !== '')
                        {
                            title.value = titleName[2];
                            let uppercase = title.value.substring(0, 1).toUpperCase();
                            title.value = `${uppercase + title.value.substring(1, title.value.length)}`;
                            if(address.value === '')
                            {
                                address.value = uppercase;
                            }
                        }
                        else if(title.value !== '' && address.value === '')
                        {
                            address.value = title.value.substring(0, 1);
                        }
                        showIcon();
                        clearTips();
                    }
                }
              )
    }
}
function clearTips()
{
    for(let i = 1; i < input.length; i++)
    {
        if(input[i].getAttribute('action') === 'active')
        {
            valid(i);
        }
    }
}
function showIcon()
{
    if(popup.getAttribute('action') === 'add' && address.value !== '')
    {
        if(address.value.match(https))
        {
            icon.setAttribute('type', 'image');
            icon.removeAttribute('value');
            icon.removeAttribute('style');
            icon.removeAttribute('color');
            icon.src = address.value;
        }
        else
        {
            icon.setAttribute('type', 'text');
            icon.removeAttribute('src');
            icon.value = address.value.substring(0, 1);
            address.value = icon.value;
            if(icon.style.backgroundColor === '')
            {
                let color = colorArr();
                icon.style.backgroundColor = color;
                icon.setAttribute('color', color);
            }
        }
    }
}
function colorArr()
{
    let arr = [
                '#1abc9c',
                '#2ecc71',
                '#3498db',
                '#9b59b6',
                '#34495e',
                '#16a085',
                '#27ae60',
                '#2980b9',
                '#8e44ad',
                '#2c3e50',
                '#f1c40f',
                '#e67e22',
                '#e74c3c',
                '#eca0f1',
                '#95a5a6',
                '#f39c12',
                '#d35400',
                '#c0392b',
                '#bdc3c7',
                '#7f8c8d'
              ],
    color = arr[Math.floor(Math.random() * arr.length)];
    return color;
}
function validAll()
{
    for(let i = 1; i < input.length; i++)
    {
        if(input[i].getAttribute('action') === 'active')
        {
            if(!valid(i))
            {
                return false;
            }
        }
    }
    return true;
}
function showData(user, engine, wallpaper, sites)
{
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('engine', engine);
    if(wallpaper)
    {
        localStorage.setItem('wallpaper', wallpaper);
    }
    localStorage.setItem('sites', JSON.stringify(sites));
    showEngine();
    showWallpaper();
    showSites();
}
function showSites()
{
    let sites = JSON.parse(localStorage.getItem('sites'));
    if(!sites) return false;

    let html = '';
    $('.website .url').remove();
    sites.sort((a, b) => a.sort - b.sort);
    for(let i = 0; i < sites.length; i++)
    {
        html = `
                    <a href="${sites[i].link}" unique="${sites[i].id}" target="_blank" class="box url">
                            <div class="img">
                                    <input type="${sites[i].attr}" ${sites[i].attr === 'image' ? `src="${sites[i].icon}" alt` : `value="${sites[i].icon}" style="background-color: ${sites[i].color}" color="${sites[i].color}"`}>
                            </div>
                            <span>${sites[i].title}</span>
                    </a>
               `;
        add.insertAdjacentHTML('beforebegin', html);
    }
}
let disabled = localStorage.getItem('setDrag') === null ? false : localStorage.getItem('setDrag') === 'true';
disabled ? setDrag.classList.add('notDrag') : setDrag.classList.remove('notDrag');
setDrag.onclick = function()
{
    disabled = !disabled;
    localStorage.setItem('setDrag', disabled);

    disabled ? setDrag.classList.add('notDrag') : setDrag.classList.remove('notDrag');
    sortable.option('disabled', !disabled);
}
let sortable = new Sortable(website, {
                                        animation: 150,
                                        swapThreshold: 1,
                                        filter: '.add',
                                        disabled: !disabled,
                                        onStart: function(e)
                                        {
                                            e.item.style.opacity = '0';
                                        },
                                        onMove: function(e)
                                        {
                                            return e.related !== add;
                                        },
                                        onEnd: function(e)
                                        {
                                            let user = JSON.parse(localStorage.getItem('user')),
                                                unique = e.item.getAttribute('unique'),
                                                newIndex = e.newIndex,
                                                oldIndex = e.oldIndex;
                                            e.item.style.opacity = '1';

                                            if(unique !== null && newIndex !== oldIndex && newIndex !== '' && oldIndex !== '')
                                            {
                                                $.ajax(
                                                        {
                                                            type: 'POST',
                                                            url: 'api.php',
                                                            data: {
                                                                    action: 'sort',
                                                                    email: user.email,
                                                                    token: user.token,
                                                                    unique: unique,
                                                                    newIndex: newIndex,
                                                                    oldIndex: oldIndex
                                                                  },
                                                            dataType: 'json',
                                                            success: function(res)
                                                            {
                                                                if(res.info)
                                                                {
                                                                    openTips();
                                                                    text.textContent = res.info;
                                                                    hideSeal();
                                                                    return false;
                                                                }
                                                                else
                                                                {
                                                                    let sites = res.data.sites;
                                                                    localStorage.setItem('sites', JSON.stringify(sites));
                                                                    showSites();
                                                                }
                                                            }
                                                        }
                                                      )
                                            }
                                        }
                                     }
                           );
function clearAll()
{
    localStorage.removeItem('user');
    localStorage.removeItem('wallpaper');
    localStorage.removeItem('sites');
    picture.style.backgroundImage = '';
    $('.website .url').remove();
    showSites();
    disabled = false;
    localStorage.setItem('setDrag', disabled);
    setDrag.classList.remove('notDrag');
    sortable.option('disabled', !disabled);
}


let string, mo;
for(let i = 0; i < input.length; i++)
{
    input[i].oncontextmenu = function(e)
    {
        cut_copy_paste.style.transform = 'scale(1)';
        cut_copy_paste.style.top = `${e.pageY}px`;
        cut_copy_paste.style.left = `${e.pageX}px`;

        if(!input[i].value.substring(input[i].selectionStart, input[i].selectionEnd))
        {
            cut.classList.remove('black');
            copy.classList.remove('black');
            cut.style.cursor = 'no-drop';
            copy.style.cursor = 'no-drop';
        }
        else
        {
            string = input[i].value.substring(input[i].selectionStart, input[i].selectionEnd);
            cut.classList.add('black');
            copy.classList.add('black');
            cut.style.cursor = 'pointer';
            copy.style.cursor = 'pointer';
        }

        mo = i;
    }
    input[i].onselect = function()
    {
        string = input[i].value.substring(input[i].selectionStart, input[i].selectionEnd);
    }

    cut.onclick = function()
    {
        navigator.clipboard.writeText(string);
        input[mo].setRangeText('', input[mo].selectionStart, input[mo].selectionEnd, 'end');
        input[mo].focus();
        string = '';

        if(mo === 8 && popup.getAttribute('action') === 'add' && address.value === '')
        {
            clearIcon();
        }
    }
    copy.onclick = function()
    {
        navigator.clipboard.writeText(string);
        input[mo].setRangeText(string, input[mo].selectionStart, input[mo].selectionEnd, 'end');
        input[mo].focus();
        string = '';
    }
    paste.onclick = function()
    {
        navigator.clipboard.readText().then((text)=>{
                                                        input[mo].value + input[mo].setRangeText(text, input[mo].selectionStart, input[mo].selectionEnd, 'end');
                                                        input[mo].focus();

                                                        if(mo === 0)
                                                        {
                                                            takeLink();

                                                            if(!search.value.trim())
                                                            {
                                                                clearSuggestion();
                                                                return false;
                                                            }
                                                            else
                                                            {
                                                                suggestions();
                                                            }

                                                            clearTimer();
                                                        }
                                                        else if(input[mo].value !== '')
                                                        {
                                                            valid(mo);
                                                            if(mo === 7)
                                                            {
                                                                TitleIcon();
                                                            }
                                                            else if(mo === 8)
                                                            {
                                                                showIcon();
                                                            }
                                                        }
                                                    }
                                           )
    }
}
document.onclick = function()
{
    cut_copy_paste.style.transform = 'scale(0)';
    string = '';

    edit_del.style.transform = 'scale(0)';
}


website.oncontextmenu = function(e)
{
    popup.setAttribute('action', 'add');
    caption.textContent = '编辑';
    address.placeholder = '图标';
    for(let i = 1; i < input.length; i++)
    {
        input[i].removeAttribute('action');
        if([6, 7, 8].includes(i))
        {
            input[i].setAttribute('action', 'active');
        }
        tips[i - 1].textContent = '';
    }
    button.textContent = '编辑';

    let url = e.target.closest('.url');
    if(url)
    {
        let href = url.getAttribute('href'),
            unique = url.getAttribute('unique'),
            input = url.querySelector('input'),
            span = url.querySelector('span');

        popup.setAttribute('unique', unique);
        title.value = span.innerText;
        link.value = href;
        if(input.type === 'image')
        {
            address.value = input.src;
            icon.setAttribute('type', 'image');
            icon.removeAttribute('value');
            icon.removeAttribute('style');
            icon.removeAttribute('color');
            icon.src = input.src;
        }
        else if(input.type === 'text')
        {
            address.value = input.value;
            icon.setAttribute('type', 'text');
            icon.removeAttribute('src');
            icon.value = input.value;
            icon.style.backgroundColor = input.getAttribute('color');
            icon.setAttribute('color', input.getAttribute('color'));
        }

        edit_del.style.transform = 'scale(1)';
        edit_del.style.top = `${e.pageY}px`;
        edit_del.style.left = `${e.pageX}px`;
    }
}
edit.onclick = function()
{
    popup.style.opacity = '1';
    popup.style.transform = 'scale(1)';
}
del.onclick = function()
{
    let user = JSON.parse(localStorage.getItem('user'));
    $.ajax(
            {
                type: 'POST',
                url: 'api.php',
                data: {
                        action: 'del',
                        email: user.email,
                        token: user.token,
                        unique: popup.getAttribute('unique')
                      },
                dataType: 'json',
                success: function(res)
                {
                    if(res.info)
                    {
                        openTips();
                        text.textContent = res.info;
                        hideSeal();
                        return false;
                    }
                    else
                    {
                        let sites = res.data.sites;
                        localStorage.setItem('sites', JSON.stringify(sites));
                        showSites();
                    }
                }
            }
          )
}


tipsOff.onclick = function()
{
    offTips();
}
seal.onclick = function()
{
    let user = JSON.parse(localStorage.getItem('user'));
    $.ajax(
            {
                type: 'POST',
                url: 'api.php',
                data: {
                        action: 'logout',
                        email: user.email,
                        token: user.token
                      },
                dataType: 'json',
                success: function(res)
                {
                    if(res.info)
                    {
                        openTips();
                        text.textContent = res.info;
                        hideSeal();
                        return false;
                    }
                    else
                    {
                        clearAll();
                    }
                }
            }
          )

    offPopup();
    offTips();
}
cancel.onclick = function()
{
    offTips();
}

function openTips()
{
    tipsPopup.style.opacity = '1';
    tipsPopup.style.transform = 'scale(1)';
}
function offTips()
{
    tipsPopup.style.opacity = '0';
    tipsPopup.style.transform = 'scale(0)';
    tipsPopup.style.transitionProperty = 'opacity, transform';
    tipsPopup.style.transitionDuration = '.5s';
}
function hideSeal()
{
    seal.style.display = 'none';
    cancel.style.width = '100%';
    cancel.textContent = '好的';
}


let domain = [/^(https?:\/\/)?([^/]+)/, /^((?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:mobile\.)?(?:wap\.)?)(.+?)(\.[^.]*[^.\d])+$/],
    backslash = [/^\/\w.*/, /^\/\/\w.*/, /\/\/.*/g],
    https = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/;