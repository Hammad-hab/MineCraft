// import  from 'react-icons/'
var Follow 
var SliderOp = { write: function (id, text) { window.onload = function () { document.getElementById(id).innerHTML = text } }, windowLike: function (id, id2, id3) { Follow = false; window.onload = function () { var Window = document.getElementById(id); Window.addEventListener('mousedown', () => { Follow = true }); window.addEventListener('mousemove', function (ev) { if (Follow === true) { var property = `margin-top: ` + ev.clientY + `px; margin-left: ` + ev.clientX + `px`; Window.setAttribute(`style`, property); console.log('X: ' + ev.clientX + '\n Y:' + ev.clientY) } }); Window.addEventListener('mouseup', () => { Follow = false }); var btn = document.getElementById(id2); btn.onclick = () => { Window.setAttribute('style', 'display: none;'); } } } }
setInterval(() => {
   var val = document.getElementById('List1').value
   if (val === 'Cool') {

   }
   else {

   }
}, 100);
const Slider = ({ id, id2 }) => {
    SliderOp.windowLike(id, id2)
    return (
        <div id={id}>
            <div className="SliderTop">
                <button className="button-danger" id={id2}>❌</button>
            </div>
            <div className="Slider" contentEditable>
            </div>
        </div>
    )
}

export default Slider