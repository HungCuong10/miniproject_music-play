const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const music= $('.playList');
const playlist = $('.playList__list');
const playlistBtn = $('.list-music');
const colseListBtn = $('.playList__close');
const nameSong = $('.song__name h5');
const singerSong = $('.song__name h6');
const cdThumd = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('.progress');
const progressCurrentTime = $('.progress-time__current-time');
const progressTimeDuration = $('.progress-time__duration');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const ramdomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const volumeBtn = $('.volume__icon');
const volumeBar = $(".volume-bar");
const volumeBarValue = $(".volume-bar-value");
const favouriteBtn = $(".favourite-music__icon");


const app = {
    currentIndex: 0,
    currentVolume: 1,
    valueVolume: 1,
    isPlaying: false,
    isRamdom: false,
    isRepeat: false,
    listOn: false,
    isMute: false,
    isFavourite: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
//List bài hát
    songs: [
            {
                name: 'Nếu lúc đó',
                singer: 'TLinh',
                path:'./assets/music/NeuLucDo-tlinh2pillz-8783613.mp3',
                image: './assets/img/song1.jpg'
            },
        
            {
                name: 'Sài Gòn hôm nay mưa',
                singer: 'JSOL & Hoàng Duyên',
                path:'./assets/music/SaiGonHomNayMua-JSOLHoangDuyen-7026537.mp3',
                image: './assets/img/song2.jpg'
            },
        
            {
                name: 'Ánh sao và Bầu trời',
                singer: 'T.R.I x Cá',
                path:'./assets/music/AnhSaoVaBauTroi-TRI-7085073.mp3',
                image: './assets/img/song3.jpg'
            },
        
            {
                name: 'Đến giờ cơm',
                singer: 'T.R.I x Cá',
                path:'./assets/music/DenGioCom-AiPhuongMinhCaRi-8552100.mp3',
                image: './assets/img/song4.jpg'
            },
        
            {
                name: 'Chuyện đôi ta',
                singer: 'Emecee L (Da LAB) ft. Muội',
                path:'./assets/music/ChuyenDoiTa-EmceeLDaLAB-7120974.mp3',
                image: './assets/img/song5.jpg'
            },
        
            {
                name: 'Chờ đợi có đáng sợ',
                singer: 'ANDIEZ',
                path:'./assets/music/ChoDoiCoDangSo-Andiez-6332589.mp3',
                image: './assets/img/song6.jpg'
            },
        
            {
                name: '3 1 0 7',
                singer: 'WHISKY & MR. PAA RMX',
                path:'./assets/music/31072-DuonggNauWn-6937818.mp3',
                image: './assets/img/song7.jpg'
            },
        
            {
                name: 'Như anh đã thấy em',
                singer: 'PhucXP',
                path:'./assets/music/NhuAnhDaThayEm-PhucXPFreakD-7370334.mp3',
                image: './assets/img/song8.jpg'
            },
        
            {
                name: 'Tháng 4 là lời nói dối của em',
                singer: 'Hà Anh Tuấn',
                path:'./assets/music/Thang4LaLoiNoiDoiCuaEmSEESINGSHARE1-HaAnhTuan-5302279.mp3',
                image: './assets/img/song9.jpg'
            },
        
            {
                name: 'The Name Of Life Piano Version',
                singer: 'V.A',
                path:'./assets/music/TheNameOfLifePianoVersion-VA-5104160.mp3',
                image: './assets/img/song10.jpg'
            }
        ],
//Hàm render bài hát
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <li class = "playList__list-item ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <img class = "playList__list-item-img" src="${song.image}">
                <div class = "playList__list-item-info">
                    <h3 class = "playList__list-item-name">${song.name}</h3>
                    <p class = "playList__list-item-singer">${song.singer}</p></p>
                </div>

                <sapn class="playList__item-option">
                    <i class="fa-solid fa-ellipsis"></i>
                </sapn>
            </li>
            `
        }) 
        playlist.innerHTML = htmls.join('')
    },
    //Hàm định nghĩa các thuộc tính cho các object
    defineProperties: function(){
        //Lấy ra bài hát đầu tiên trong danh sách bài hát 
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    //Hàm load nhạc đầu tiên trong danh dách
    loadCurrentSong: function(){
        nameSong.textContent = this.currentSong.name;
        singerSong.textContent = this.currentSong.singer;
        cdThumd.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
//Hàm xử lý cách thao tác trên ứng dụng
    handleEvents: function(){
        const _this = this;
        //Hiệu ứng quay cd thumd
        cdThumdAnimation = cdThumd.animate([
            {transform: 'rotate(360deg)'}
        ],
        {
            duration: 10000, //tốc độ quay 10 giây
            iterations: Infinity 
        })
        cdThumdAnimation.pause(); 
        //Khi click vào playlist
        playlistBtn.onclick = function(){
            _this.listOn = true;
            music.classList.add('list-open');
        }
        //Khi click vào nút close
        colseListBtn.onclick = function(){
            _this.listOn = false;
            music.classList.remove('list-open');
        }
        //Khi click vào nút play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
                cdThumdAnimation.pause();
            } else{
                audio.play();
                cdThumdAnimation.play();
            }
        }
        //Khi ấn váo nút space
        window.onkeydown = function(e){
            if(e.keyCode === 32){
                playBtn.click();
            }
        }

        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
        }

        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing'); //Remove class playing
        }
        // Khi tua nhạc
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value //Đổi từ % ra số giây (thời gian của nhạc / 100 * giá trị % khi tua)
            audio.currentTime = seekTime;
        }
        //Thay đổi thanh tiến trình bài hát
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPrecent = Math.floor(audio.currentTime / audio.duration *100);
                progress.value = progressPrecent;
                
                progressCurrentTime.textContent = _this.getMinutesSong(audio.currentTime);

                progressTimeDuration.textContent = _this.setMinutesSong();      
            }

        }
        //Khi next bài hát
        nextBtn.onclick = function(){
            if(_this.isRamdom){
                _this.ramdomSong();
            }
            _this.nextSong();
            audio.play();
            cdThumdAnimation.play();
        }
        //Khi prev bài hát
        prevBtn.onclick = function(){
            if(_this.isRamdom){
                _this.ramdomSong();
            }
            _this.prevSong();
            audio.play();
            cdThumdAnimation.play();
        }
        //Khi ramdom song
        ramdomBtn.onclick = function(){
            _this.isRamdom = !_this.isRamdom;
            //Kiểm tra nút lặp lại có đang bật
            if(_this.isRepeat === true){
                repeatBtn.classList.remove('active');
                _this.isRepeat = false;
            }
            ramdomBtn.classList.toggle('active', _this.isRamdom);
        }
        //Khi chọn lặp lại bài
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            //Kiểm tra nút đảo lộn có đang bật
            if(_this.isRamdom === true){
                ramdomBtn.classList.remove('active');
                _this.isRamdom = false;
            }
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        //Khi bài hát kết thúc 
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }
            else{
                nextBtn.click();
            }
        }
        //Khi chọn bài trong danh sách
        playlist.onclick = function(e){
            const songElement = e.target.closest(".playList__list-item:not(.active)");
            const optionElement = e.target.closest(".playList__item-option");
            if(songElement || optionElement){
                if(songElement && !optionElement){
                    _this.currentIndex = Number(songElement.dataset.index);
                    _this.loadCurrentSong();
                    cdThumdAnimation.play();
                    _this.render();
                    audio.play();
                }
                else {
                    alert('Chức năng này đang phát triển. Xin lỗi bạn vì sự bất tiện này');
                }
            }
        }
        //Khi ấn vào nút volume
        volumeBtn.onclick = function(){
            _this.isMute = !_this.isMute;
            volumeBtn.classList.toggle('active', _this.isMute)
            if(_this.isMute){
                audio.volume = 0;
                volumeBarValue.value = 0; // Đưa thanh âm lượng về 0
            }else{
                audio.volume = _this.currentVolume;
                volumeBarValue.value = _this.valueVolume // Giữ lại âm lượng khi thay đổi
            }
        }
        //Khi thay đổi volume
        volumeBarValue.onchange = function(e){
            _this.valueVolume = e.target.value;
            audio.volume = _this.valueVolume;
        }
        //Khi chọn yêu thích
        favouriteBtn.onclick = function(){
            _this.isFavourite = !_this.isFavourite;
            if(_this.isFavourite === true){
                favouriteBtn.classList.toggle('active', _this.isFavourite); 
            }
            else{
                favouriteBtn.classList.remove('active'); 
            }
        }
    },
// Hàm lấy ra số phút của bài hát
    setMinutesSong() {
        const time = audio.duration;
        const minutes = Math.floor(time / 60).toString().padStart(2, "0");
        const seconds = Math.floor(time - 60 * minutes).toString().padStart(2, "0");
        return (finalTime = minutes + ":" + seconds);
    },
    getMinutesSong() {
        const time = audio.currentTime;
        const minutes = Math.floor(time / 60).toString().padStart(2, "0");
        const seconds = Math.floor(time - 60 * minutes).toString().padStart(2, "0");
        return (finalTime = minutes + ":" + seconds);
    },
//Hàm next song
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
//Hàm load config
    loadConfig: function(){

    },
//Hàm prev song
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
//Hàm ramdom
    ramdomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length) // Hàm ramdom
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },


    start: function(){
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();
        //Render Playlist
        this.render();
        //Lắng nghe/ Xử lý các sự kiện (DOM events)
        this.handleEvents();
        // Tải thông tin bài hát đầu tiên vào UI khi chạy
        this.loadCurrentSong();

    }
}

app.start();