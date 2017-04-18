import {Component} from 'angular2/core';


@Component({
    template: `
       
            <paper-toolbar>
                <paper-icon-button icon="menu" paper-drawer-toggle></paper-icon-button>
                <span class="title">Main</span>
            </paper-toolbar>
            
            <div class="all">
                <div class="content">
                    <h2>Welcome to AN-HE Three-Dimensional</h2>

                    <img id="img" src="../../../assets/img/ANHE-LOGO.png" alt="ANHE-LOGO">
                </div>



                <footer>
                    <p>© 2015-2016 AN-HE THREE-DIMENSIONAL ALL RIGHTS RESERVED</p>
                </footer>
            </div>
            
    `,
    styles: [`
        
        
        paper-toolbar {
            background-color: #0f7595;
        }
        img{
            width: 50vh;
            height: 50vh;
            display: block;
            /*// max-height: 350px;*/
            margin: 20px auto 20px auto;
            /*-webkit-filter: blur(1px);*/
            /*filter: blur(3px);*/
        }
        .content h2{
            height: 100%;
            text-align: center;
            color: black;
        }
        footer {
            text-align: center;
            font-size: 9px;
            color: black;
        }
        .all {
            /*border: 1px solid transparent;*/
            /*height: 100%;*/
            /*background: linear-gradient(141deg, red 0%, #1fc8db 51%, #2cb5e8 75%);*/
        }
        `]
})
export class MainComponent{
}