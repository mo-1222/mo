let popup = document.querySelector('.popup'),
    caption = document.querySelector('.caption'),
    off = document.querySelector('.off'),
    email = document.querySelector('.email'),
    code = document.querySelector('.code'),
    show = document.querySelector('.show'),
    wd = document.querySelector('.wd'),
    keyword = document.querySelector('.keyword'),
    suggestion = document.querySelector('.suggestion'),
    button = document.querySelector('.popup button:nth-child(9)'),
    search = document.querySelector('.search'),
    single = document.querySelector('.single'),
    similar = document.querySelector('.similar'),
    whole = document.querySelector('.whole'),
    chinese = document.querySelector('.chinese'),
    other = document.querySelector('.other'),
    table = document.querySelector('.table'),
    add = document.querySelector('.add'),
    query = document.querySelector('.query'),
    name = document.querySelector('.user'),
    exit = document.querySelector('.exit'),
    action = document.querySelector('.action'),
    selectAll = document.querySelector('.selectAll'),
    selectDel = document.querySelector('.selectDel'),
    pagination = document.querySelector('.pagination'),
    readonlyData = document.querySelector('.readonlyData'),
    readonlyRow = document.querySelector('.readonlyRow'),
    readonlyPage = document.querySelector('.readonlyPage'),
    readonlyBtn = document.querySelector('.readonlyBtn'),
    selectMaxRow = document.querySelector('.selectMaxRow'),
    selectMaxBtn = document.querySelector('.selectMaxBtn'),
    prev = document.querySelector('.prev'),
    next = document.querySelector('.next'),
    pageBtn = document.querySelector('.pageBtn'),
    page = document.querySelector('.page'),
    go = document.querySelector('.go'),
    cut_copy_paste = document.querySelector('.cut_copy_paste'),
    cut = document.querySelector('.cut'),
    copy = document.querySelector('.copy'),
    paste = document.querySelector('.paste'),
    tipsPopup = document.querySelector('.tipsPopup'),
    tipsOff = document.querySelector('.tipsPopup .off'),
    text = document.querySelector('.tipsPopup span:nth-child(3)'),
    good = document.querySelector('.good'),

    input = document.querySelectorAll('[mo="mo"]'),
    empty = document.querySelectorAll('.empty'),
    tips = document.querySelectorAll('.tips'),
    setLang = document.querySelectorAll('.chinese, .other'),
    selectBox = document.querySelectorAll('.selectBox'),
    setMax = document.querySelectorAll('.selectMaxRow span, .selectMaxBtn span'),

    btnGroupPage = 1,
    btnActiveIndex = 0;


showLogin();
if(!localStorage.getItem('language'))
{
    localStorage.setItem('language', 'chinese');
}
add.onclick = function()
{
    let language = localStorage.getItem('language');
    
    popup.setAttribute('action', 'add');
    openPopup(language === 'chinese' ? [2, 3, 4] : [4]);
    popup.setAttribute('language', language);
    caption.textContent = '添加词库';
    button.textContent = '添加词库';
    showLangColor();
}
query.onclick = function()
{
    popup.setAttribute('action', 'query');
    openPopup();
}
exit.onclick = function()
{
    localStorage.removeItem('user');
    localStorage.removeItem('totalData');
    localStorage.removeItem('search');

    popup.setAttribute('action', 'login');
    openPopup([0, 1]);
    table.style.display = 'none';
}
off.onclick = function()
{
    offPopup();
}
for(let i = 0; i < input.length; i++)
{
    input[i].onkeydown = function(e)
    {
        if(e.keyCode === 13 && popup.getAttribute('action') !== 'query' && input[i].getAttribute('action') === 'active')
        {
            e.preventDefault();
            if(valid(i))
            {
                inputFocus(i);
            }
            button.click();
        }
    }
}
search.onkeydown = function(e)
{
    if(e.keyCode === 13)
    {
        e.preventDefault();
    }
}
for(let i = 0; i < empty.length; i++)
{
    empty[i].onclick = function()
    {
        input[i].value = '';
        input[i].focus();
    }
}
show.onclick = function()
{
    if(code.type === 'password')
    {
        code.setAttribute('type', 'text');
        code.setSelectionRange(code.value.length, code.value.length);
        show.classList.add('hide');
        code.focus();
    }
    else
    {
        code.setAttribute('type', 'password');
        show.classList.remove('hide');
    }
}
button.onclick = function()
{
    if(!validAll())
    {
        for(let i = 0; i < input.length; i++)
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
            setDataRow = parseInt(localStorage.getItem('setDataRow'), 10),
            action = popup.getAttribute('action'),
            unique = popup.getAttribute('unique'),
            language = popup.getAttribute('language');
        if(action === 'login')
        {
            clearStorage();
            $.ajax(
                    {
                        type: 'POST',
                        url: 'suggestion.php',
                        data: {
                                action: 'login',
                                email: email.value,
                                password: code.value,
                                setDataRow: setDataRow
                              },
                        dataType: 'json',
                        success: function(res)
                        {
                            if(res.info)
                            {
                                openTips();
                                text.textContent = res.info;
                                return false;
                            }
                            else
                            {
                                localStorage.setItem('user', JSON.stringify(res.data.user));
                                parseInt(res.data.totalData, 10) !== 0 ? localStorage.setItem('totalData', res.data.totalData) : localStorage.removeItem('totalData');
                                table.style.display = 'block';
                                name.textContent = res.data.user.name;
                                showData(setDataRow, 1, res.data.suggestions);
                                offPopup();
                            }
                        }
                    }
                  )
        }
        else if(action === 'add')
        {
            clearStorage();
            $.ajax(
                    {
                        type: 'POST',
                        url: 'suggestion.php',
                        data: {
                                action: 'add',
                                email: user.email,
                                token: user.token,
                                unique: unique,
                                wd: wd.value,
                                keyword: keyword.value,
                                suggestion: suggestion.value,
                                language: language
                              },
                        dataType: 'json',
                        success: function(res)
                        {
                            if(res.info)
                            {
                                if(res.info === 'success')
                                {
                                    let row = document.querySelector(`.row[unique="${unique}"]`);
                                    row.querySelector('.row > span:nth-child(3)').textContent = wd.value;
                                    row.querySelector('.row > span:nth-child(4)').textContent = keyword.value;
                                    row.querySelector('.row > span:nth-child(5)').textContent = suggestion.value;
                                    clearValue();
                                }

                                res.info !== 'success' ? openTips() : '';
                                text.textContent = res.info === 'failure' ? '词库数据更新失败！' : res.info;
                                return false;
                            }
                            else
                            {
                                localStorage.removeItem('totalData');
                                showData(setDataRow, 1, res.data.suggestions);
                                clearValue();
                            }
                        }
                    }
                  )
        }
    }
}
single.onclick = function()
{
    if(valid(5))
    {
        queryData(search.value, 'single');
    }
}
similar.onclick = function()
{
    if(valid(5))
    {
        queryData(search.value, 'similar');
    }
}
whole.onclick = function()
{
    queryData('', 'whole');
}
chinese.onclick = function()
{
    localStorage.setItem('language', 'chinese');
    openPopup([2, 3, 4]);
    popup.setAttribute('language', 'chinese');
    caption.textContent = '添加词库';
    button.textContent = '添加词库';
    showLangColor();
}
other.onclick = function()
{
    localStorage.setItem('language', 'other');
    openPopup([4]);
    popup.setAttribute('language', 'other');
    caption.textContent = '添加词库';
    button.textContent = '添加词库';
    showLangColor();
}

function showLogin()
{
    let user = JSON.parse(localStorage.getItem('user'));
    if(!user)
    {
        popup.setAttribute('action', 'login');
        openPopup([0, 1]);
    }
    else
    {
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0)';
        table.style.display = 'block';
        name.textContent = user.name;
        queryData('', 'whole');
    }
}
function showLangColor()
{
    let language = localStorage.getItem('language');

    for(let i = 0; i < setLang.length; i++)
    {
        setLang[i].style.color = setLang[i].classList.contains(language) ? '#ff6f66' : '';
    }
}
function openPopup(active)
{
    popup.removeAttribute('unique');
    popup.removeAttribute('language');
    popup.style.opacity = '1';
    popup.style.transform = 'scale(1)';
    caption.textContent = '';
    off.style.display = popup.getAttribute('action') === 'login' ? 'none' : 'block';
    for(let i = 0; i < input.length; i++)
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
        tips[i].textContent = '';
    }
    button.textContent = '';
}
function offPopup()
{
    popup.style.opacity = '0';
    popup.style.transform = 'scale(0)';
    popup.style.transitionProperty = 'opacity, transform';
    popup.style.transitionDuration = '.5s';
}
function valid(active)
{
    let Input = input[active],
        Text = Input.placeholder,
        Tips = tips[active];
    Tips.textContent = '';

    if(Input.value === '')
    {
        Tips.textContent = `请输入${Text}！`;
        return false;
    }
    else if(active === 0 && !email.value.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/))
    {
        Tips.textContent = `请输入有效的${Text}！`;
        return false;
    }
    else if(active === 1 && code.value.length < 6)
    {
        Tips.textContent = `${Text}长度不能小于6位！`;
        return false;
    }
    else if(active === 1 && !code.value.match(letter))
    {
        Tips.textContent = `请输入英文或数字类型的${Text}！`;
        return false;
    }
    else if(active === 2 && !wd.value.match(letter))
    {
        Tips.textContent = '请输入关键字拼音字母简拼！';
        return false;
    }
    else if(active === 3 && !keyword.value.match(letter))
    {
        Tips.textContent = '请输入关键字拼音字母全拼！';
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
function validAll()
{
    for(let i = 0; i < input.length; i++)
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
function clearValue()
{
    wd.value = '';
    keyword.value = '';
    suggestion.value = '';
}
function queryData(search, query)
{
    let user = JSON.parse(localStorage.getItem('user')),
        setDataRow = parseInt(localStorage.getItem('setDataRow'), 10),
        wd = localStorage.getItem('search');

    if(!user) return false;
    clearStorage();
    $.ajax(
            {
                type: 'POST',
                url: 'suggestion.php',
                data: {
                        action: 'query',
                        email: user.email,
                        token: user.token,
                        setDataRow: setDataRow,
                        wd: search || wd,
                        query: query
                      },
                dataType: 'json',
                success: function(res)
                {
                    if(res.info)
                    {
                        openTips();
                        text.textContent = res.info === 'failure' ? info(query) : res.info;
                        return false;
                    }
                    else
                    {
                        res.data.totalData !== undefined ? localStorage.setItem('totalData', res.data.totalData) : localStorage.removeItem('totalData');
                        search !== undefined && query === 'similar' && res.data.totalData !== undefined ? localStorage.setItem('search', search) : clearStorage();
                        showData(setDataRow, 1, res.data.suggestions);
                    }
                }
            }
          )
}
function info(query)
{
    let info = {
                    single: '未查询到词库数据，请尝试相似或全部按钮！',
                    similar: '未查询到词库数据，请添加正在查询的关键字！',
                    whole: '未查询到词库数据，请添加词库数据！'
               };
    return info[query];
}
function clearStorage()
{
    localStorage.removeItem('search');
}

table.onclick = function(e)
{
    if(e.target.matches('.selectRow'))
    {
        showRowColor(e.target);
        updateTextState();
    }
    else if(e.target.matches('.edit'))
    {
        let row = e.target.closest('.row'),
            unique = row.getAttribute('unique'),
            language = row.getAttribute('language');

        localStorage.setItem('language', language);
        popup.setAttribute('action', 'add');
        openPopup(language === 'chinese' ? [2, 3, 4] : [4]);
        popup.setAttribute('unique', unique);
        popup.setAttribute('language', language);
        caption.textContent = '编辑词库';
        wd.value = language === 'chinese' ? row.querySelector('.row > span:nth-child(3)').innerText : '';
        keyword.value = language === 'chinese' ? row.querySelector('.row > span:nth-child(4)').innerText : '';
        suggestion.value = row.querySelector('.row > span:nth-child(5)').innerText;
        button.textContent = '编辑词库';
        showLangColor();
        clearSelect();
    }
    else if(e.target.matches('.del'))
    {
        let row = e.target.closest('.row'),
            unique = row.getAttribute('unique');

        delRow(unique);
    }
    else if(e.target.closest('.row'))
    {
        let selectRow = e.target.closest('.row').querySelector('.selectRow');

        selectRow.checked = !selectRow.checked;
        showRowColor(selectRow);
        updateTextState();
    }
}
selectAll.onclick = function()
{
    let totalData = parseInt(localStorage.getItem('totalData'), 10),
        selectRow = document.querySelectorAll('.selectRow');
    if(!totalData && selectRow.length === 0 || totalData === 0 && selectRow.length === 0 || selectRow.length === 0)
    {
        openTips();
        text.textContent = '请添加词库数据！';
        return false;
    }

    for(let i = 0; i < selectRow.length; i++)
    {
        selectRow[i].checked = selectAll.checked;
        showRowColor(selectRow[i]);
    }
    updateTextState();
}
selectDel.onclick = function()
{
    let totalData = parseInt(localStorage.getItem('totalData'), 10),
        selectRow = document.querySelectorAll('.selectRow'),
        checkedRow = document.querySelectorAll('.selectRow:checked'),
        unique = [];
    if(!totalData && selectRow.length === 0 || totalData === 0 && selectRow.length === 0 || selectRow.length === 0)
    {
        openTips();
        text.textContent = '请添加词库数据！';
        return false;
    }
    else if(checkedRow.length === 0 && selectRow.length > 0)
    {
        openTips();
        text.textContent = '请选中需要删除的行数据！';
        return false;
    }

    for(let i = 0; i < checkedRow.length; i++)
    {
        let row = checkedRow[i].closest('.row');
        unique.push(parseInt(row.getAttribute('unique'), 10));
    }
    delRow(unique);
}

function showData(setDataRow, currentPage, suggestions)
{
    let html = '';
    $('.table .row').remove();
    for(let i = 0; i < suggestions.length; i++)
    {
        let serialNumber = (currentPage - 1) * setDataRow + i + 1;
        html = `
                    <div class="row" unique="${suggestions[i].id}" language="${suggestions[i].language}">
                            <span>
                                    <span class="checkbox">
                                            <input type="checkbox" class="selectRow">
                                            <span>
                                                    <span></span>
                                            </span>
                                    </span>
                            </span>
                            <span>${serialNumber}</span>
                            <span>${suggestions[i].language === 'chinese' ? suggestions[i].wd : ''}</span>
                            <span>${suggestions[i].language === 'chinese' ? suggestions[i].keyword : ''}</span>
                            <span>${suggestions[i].suggestion}</span>
                            <span class="edit_del">
                                    <span class="edit"></span>
                                    <span class="del"></span>
                            </span>
                    </div>
               `;
        action.insertAdjacentHTML('beforebegin', html);
    }
    updateTextState();
    let setBtnGroup = parseInt(localStorage.getItem('setBtnGroup'), 10);
    btnGroupPage = Math.ceil(currentPage / setBtnGroup);
    btnActiveIndex = (currentPage - 1) % setBtnGroup;
    showPagination();
}
function showRowColor(selectRow)
{
    let row = selectRow.closest('.row');
    row.style.backgroundColor = selectRow.checked ? 'var(--black-10)' : '';
}
function updateTextState()
{
    let selectRow = document.querySelectorAll('.selectRow'),
        checkedRow = document.querySelectorAll('.selectRow:checked');

    selectAll.checked = checkedRow.length === selectRow.length && selectRow.length > 0;
    document.querySelector('.action .checkbox > span:last-child').textContent = checkedRow.length === selectRow.length && selectRow.length > 0 ? '全不选' : '全选';
}
function clearSelect()
{
    let selectRow = document.querySelectorAll('.selectRow');

    if(selectRow.length > 0)
    {
        for(let i = 0; i < selectRow.length; i++)
        {
            selectRow[i].checked = false;
            showRowColor(selectRow[i]);
        }
        updateTextState();
    }
}
function delRow(unique)
{
    let user = JSON.parse(localStorage.getItem('user')),
        setDataRow = parseInt(localStorage.getItem('setDataRow'), 10),
        setBtnGroup = parseInt(localStorage.getItem('setBtnGroup'), 10),

        startNumber = (btnGroupPage - 1) * setBtnGroup + 1,
        currentPage = startNumber + btnActiveIndex,
        wd = localStorage.getItem('search');

    $.ajax(
            {
                type: 'POST',
                url: 'suggestion.php',
                data: {
                        action: 'del',
                        email: user.email,
                        token: user.token,
                        setDataRow: setDataRow,
                        currentPage: currentPage,
                        unique: unique,
                        wd: wd
                      },
                dataType: 'json',
                success: function(res)
                {
                    if(res.info)
                    {
                        openTips();
                        text.textContent = res.info === 'failure' ? '词库数据删除失败！' : res.info;
                        return false;
                    }
                    else
                    {
                        parseInt(res.data.totalData, 10) !== 0 ? localStorage.setItem('totalData', res.data.totalData) : localStorage.removeItem('totalData');
                        wd !== null && parseInt(res.data.totalData, 10) === 0 ? clearStorage() : '';
                        wd !== null && parseInt(res.data.totalData, 10) === 0 ? openDelTips('查询数据已全部删除，请重新查询数据！') : '';
                        wd === null && parseInt(res.data.totalData, 10) === 0 ? openDelTips('词库数据已全部删除，请添加词库数据！') : '';
                        showData(setDataRow, parseInt(res.data.currentPage, 10), res.data.suggestions);
                    }
                }
            }
          )
}
function openDelTips(info)
{
    openTips();
    text.textContent = info;
}

if(!localStorage.getItem('setDataRow') && !localStorage.getItem('setBtnGroup'))
{
    localStorage.setItem('setDataRow', 10);
    localStorage.setItem('setBtnGroup', 6);
}
for(let i = 0; i < selectBox.length; i++)
{
    let maxRow_maxBtn = selectBox[i].querySelector('.selectMaxRow, .selectMaxBtn'),
        arrow = selectBox[i].querySelector('.arrow');

    selectBox[i].onclick = function()
    {
        selectBox[i].classList.toggle('selectBox_radius');
        maxRow_maxBtn.classList.toggle('maxRow_maxBtn');
        arrow.classList.toggle('arrow_deg');
    }
}
selectMaxRow.onclick = function(e)
{
    if(e.target.matches('.selectMaxRow span'))
    {
        readonlyRow.textContent = e.target.innerText;
        localStorage.setItem('setDataRow', parseInt(e.target.innerText, 10));

        showReadonly();
        btnGroupPage = 1;
        btnActiveIndex = 0;
        showBtn();
        currentPage();
    }
}
selectMaxBtn.onclick = function(e)
{
    if(e.target.matches('.selectMaxBtn span'))
    {
        readonlyBtn.textContent = e.target.innerText;
        localStorage.setItem('setBtnGroup', parseInt(e.target.innerText, 10));

        showColor();
        let setBtnGroup = parseInt(localStorage.getItem('setBtnGroup'), 10),
            page = parseInt(document.querySelector('.active').innerText, 10);
        btnGroupPage = Math.ceil(page / setBtnGroup);
        btnActiveIndex = (page - 1) % setBtnGroup;
        showBtn();
        clearSelect();
    }
}
prev.onclick = function()
{
    updatePagination(false);
}
next.onclick = function()
{
    updatePagination(true);
}
pageBtn.onclick = function(e)
{
    let setBtnGroup = parseInt(localStorage.getItem('setBtnGroup'), 10);

    if(e.target.matches('.pageBtn span'))
    {
        document.querySelector('.active').classList.remove('active');
        e.target.classList.add('active');

        btnActiveIndex = parseInt(e.target.innerText, 10) - (btnGroupPage - 1) * setBtnGroup - 1;
        updateBtnState();
        currentPage();
    }
}
go.onclick = function()
{
    let setDataRow = parseInt(localStorage.getItem('setDataRow'), 10),
        setBtnGroup = parseInt(localStorage.getItem('setBtnGroup'), 10),
        totalData = parseInt(localStorage.getItem('totalData'), 10),
        totalPage = Math.ceil(totalData / setDataRow);

    if(parseInt(page.value, 10) >= 1 && parseInt(page.value, 10) <= totalPage)
    {
        btnGroupPage = Math.ceil(parseInt(page.value, 10) / setBtnGroup);
        btnActiveIndex = (parseInt(page.value, 10) - 1) % setBtnGroup;
        showBtn();
        currentPage();
    }
    else
    {
        openTips();
        text.textContent = totalPage > 1 ? `请输入1到${totalPage}之间的有效页码！` : '只有一页，无需输入！';
    }
    page.value = '';
}

function showPagination()
{
    let totalData = parseInt(localStorage.getItem('totalData'), 10);

    pagination.style.display = !totalData || totalData === 0 ? 'none' : 'flex';
    !totalData || totalData === 0 ? '' : showReadonly();
    !totalData || totalData === 0 ? '' : showBtn();
}
function showReadonly()
{
    let setDataRow = parseInt(localStorage.getItem('setDataRow'), 10),
        setBtnGroup = parseInt(localStorage.getItem('setBtnGroup'), 10),
        totalData = parseInt(localStorage.getItem('totalData'), 10),
        totalPage = Math.ceil(totalData / setDataRow);

    readonlyData.textContent = `共${totalData}条`;
    readonlyRow.textContent = `${setDataRow}条/页`;
    readonlyPage.textContent = `共${totalPage}页`;
    readonlyBtn.textContent = `${setBtnGroup}个/组按钮`;
    showColor();
}
function showColor()
{
    let setDataRow = parseInt(localStorage.getItem('setDataRow'), 10),
        setBtnGroup = parseInt(localStorage.getItem('setBtnGroup'), 10);
    
    for(let i = 0; i < setMax.length; i++)
    {
        setMax[i].style.color = parseInt(setMax[i].innerText, 10) === setDataRow || parseInt(setMax[i].innerText, 10) === setBtnGroup ? '#ff6f66' : 'white';
    }
}
function showBtn()
{
    let setDataRow = parseInt(localStorage.getItem('setDataRow'), 10),
        setBtnGroup = parseInt(localStorage.getItem('setBtnGroup'), 10),
        totalData = parseInt(localStorage.getItem('totalData'), 10),
        totalPage = Math.ceil(totalData / setDataRow),

        startNumber = (btnGroupPage - 1) * setBtnGroup + 1;
        endNumber = Math.min(startNumber + setBtnGroup - 1, totalPage);

    pageBtn.innerHTML = '';
    for(let i = startNumber; i <= endNumber; i++)
    {
        let span = document.createElement('span');
            span.textContent = i;
        if(i === startNumber + btnActiveIndex)
        {
            span.classList.add('active');
        }
        pageBtn.appendChild(span);
    }
    updateBtnState();
}
function updateBtnState()
{
    let setDataRow = parseInt(localStorage.getItem('setDataRow'), 10),
        setBtnGroup = parseInt(localStorage.getItem('setBtnGroup'), 10),
        totalData = parseInt(localStorage.getItem('totalData'), 10),
        totalPage = Math.ceil(totalData / setDataRow),

        startNumber = (btnGroupPage - 1) * setBtnGroup + 1;

    prev.disabled = (startNumber + btnActiveIndex === 1);
    next.disabled = (startNumber + btnActiveIndex === totalPage);
}
function updatePagination(boolean)
{
    let setBtnGroup = parseInt(localStorage.getItem('setBtnGroup'), 10);

    if(boolean)
    {
        if(btnActiveIndex < setBtnGroup - 1)
        {
            btnActiveIndex++;
        }
        else
        {
            btnGroupPage++;
            btnActiveIndex = 0;
        }
    }
    else
    {
        if(btnActiveIndex > 0)
        {
            btnActiveIndex--;
        }
        else
        {
            btnGroupPage--;
            btnActiveIndex = setBtnGroup - 1;
        }
    }
    showBtn();
    currentPage();
}
function currentPage()
{
    let user = JSON.parse(localStorage.getItem('user')),
        setDataRow = parseInt(localStorage.getItem('setDataRow'), 10),
        setBtnGroup = parseInt(localStorage.getItem('setBtnGroup'), 10),

        startNumber = (btnGroupPage - 1) * setBtnGroup + 1,
        currentPage = startNumber + btnActiveIndex,
        wd = localStorage.getItem('search');

    $.ajax(
            {
                type: 'POST',
                url: 'suggestion.php',
                data: {
                        action: 'pagination',
                        email: user.email,
                        token: user.token,
                        setDataRow: setDataRow,
                        currentPage: currentPage,
                        wd: wd
                      },
                dataType: 'json',
                success: function(res)
                {
                    if(res.info)
                    {
                        openTips();
                        text.textContent = res.info;
                        return false;
                    }
                    else
                    {
                        showData(setDataRow, currentPage, res.data.suggestions);
                    }
                }
            }
          )
}

document.oncontextmenu = function(e)
{
    e.preventDefault();
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
            cut.style.cursor = 'not-allowed';
            copy.style.cursor = 'not-allowed';
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

                                                        input[mo].value !== '' ? valid(mo) : '';
                                                    }
                                           );
    }
}
document.onclick = function()
{
    cut_copy_paste.style.transform = 'scale(0)';
    string = '';
}

tipsOff.onclick = function()
{
    offTips();
}
good.onclick = function()
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

let letter = /^[A-Za-z0-9]*$/;