let index = 0;
let para="5";
const values = ['because of the top 1% of the 1%  ', 'that relationships Are About Control  ', 'about Wearing A Mask  ', 
'about The People Who Care  ', 'about Changing The World  ', 'that Wars Aren’t Meant To Be Won  ', 'about Living in Paranoia  ', 
'about Find the Worst in People  ', 'about The Code of Chaos  ', 'that the People are Vulnerable  ', 'It’s Not Real  ', 
'Our True Selves  ', 'for Control Is An Illusion  ', 'about The World Is A Hoax  ', 'about Saving The World  '];
let curr_msg = 0;
function write(){
    if(index == para.length){ curr_msg++; return del(); }
    document.getElementById('next_answer').innerHTML = document.getElementById('next_answer').innerHTML + para[index];
    index++;
    setTimeout(write, 100);
}

function del(){
    if(document.getElementById('next_answer').innerHTML=="") return write();
    index = 0;
    if(curr_msg == values.length) curr_msg = 0;
    para = values[curr_msg];
    document.getElementById('next_answer').innerHTML = document.getElementById('next_answer').innerHTML.substring(0, document.getElementById('next_answer').innerHTML.length-1);
    setTimeout(del, 80);
}

write();