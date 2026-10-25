const screen_dimming = document.getElementById('dimming');
const search_bar = document.getElementById('search-bar')
const search_box = document.getElementById('search-box')
const search_box_parent = document.getElementById('search-box-parent')

search_bar.addEventListener('click', () => {
        screen_dimming.style.display = 'initial'
        screen_dimming.style.background = 'rgba(0,0,0,0)'
        screen_dimming.style.background = 'rgba(0,0,0,.3)'
        search_box_parent.style.display = 'flex'
        
})
screen_dimming.addEventListener('click', () => {
        screen_dimming.style.display = 'none'
        search_box_parent.style.display = 'none'
})