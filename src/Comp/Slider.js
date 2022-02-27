import { AiFillEye } from 'react-icons/ai'
var Value;
var obj = {
    width: '10px',
}
var SACHDC = () => {

    return (
        <>
            <a href="#" class="info-special controlHref" onClick={
                function () {
                    var div = document.getElementById('div')
                    if (div.getAttribute('class') === "info-special-div fadeOut" || div.getAttribute('class') === "info-special-div hidden") {
                        div.setAttribute('class', 'info-special-div fadeIn')
                    } else {
                        div.setAttribute('class', 'info-special-div fadeOut')
                    }
                }
            }>Control Height</a>
            <div class="info-special-div hidden" id="div">
                <input class="info-special" type="range" max="100" min="0" name="SliderHeightControl" id="Slider" onChange={function () {
                    Value = document.getElementById('Slider').value
                    document.getElementById("label").innerHTML = Value
                    localStorage.setItem("Z", Value)

                }} />
                <label for="SliderHeightContorl" class="info-special">Height: </label>
                <br />
                <label id="label" class="info-special left_top">
                    10
                 
                </label>
                <p class="info-special darkTheme" onClick={function () {
                    var divSpecial = document.getElementById('container')
                    divSpecial.setAttribute('class', 'container info-special')
                }}><AiFillEye ></AiFillEye></p>
                {/* <div class="container info-special hidden" id='container'>
                    <div class="container-childrenBox" id='Adjustable' ><b class="containerLabel">Adjustable</b></div>
                    <div class="container-childrenBox"><b class="containerLabel">Non-Adjustable</b></div>
                </div> */}
            </div>

        </>
    )
}
export default SACHDC