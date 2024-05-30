import {choc, set_content, on, DOM, fix_dialogs} from "https://rosuav.github.io/choc/factory.js";
const {BLOCKQUOTE, BUTTON, DIALOG, DIV, FIGCAPTION, FIGURE, H2, H3, LI, P, SECTION, UL} = choc; //autoimport

let selected_item = 0;
let selected_set = 0;

const sets = Object.keys(galleries);
sets.sort((a, b) => galleries[a].sequence - galleries[b].sequence); // sort for by category
console.log(sets);

document.body.appendChild(DIALOG({id: "gallerydlg"}, [
  DIV({id: "dialog_header"}, [
    DIV([BUTTON({id: "prev"}, "previous"), BUTTON({id: "next"}, "next")]),
    BUTTON({type: "button", class: "dialog_cancel"}, 'x')]),
  FIGURE([
    DIV({class: 'gallery-image'}),
    FIGCAPTION()
  ])
]));

// Support for older browsers
fix_dialogs({close_selector: ".dialog_cancel,.dialog_close", click_outside: "formless"});

function gallery_image(item) {
  let title = "";
  if (item.project) title += item.project + " ";
  if (item.artist) title += item.artist + " ";
  if (item.caption) title += item.caption + " ";
  return DIV({class: 'gallery-image', style: `background-image: url("${item.image.url}")`, title: title});
}

{
  set_content("#gallery",
    sets.map((set, idx )=> galleries[set] && SECTION({'data-set': idx}, [
      H2(set.replace(/_/g, " ")),
      P(galleries[set].description),
      DIV({class: "gallery_set"}, galleries[set].photos.map((item, idx) => item.image &&
        DIV(
          {"data-idx": idx, class: "gallery_entry"},
          item.caption ? FIGURE([gallery_image(item), FIGCAPTION(item.caption)]) : gallery_image(item)
        ))),
      P(UL(galleries[set].photos.map((item, idx) => !item.image &&
        LI([
          item.notes && BLOCKQUOTE(item.notes),
        ]))))
    ]))
  );
}

function display_item(set, idx) {
  selected_item = +idx; // cast as number
  selected_set = +set;
  const item = galleries[sets[set]].photos[idx];
  console.log(item);
  DOM("#gallerydlg .gallery-image").replaceWith(gallery_image(item));
  set_content("#gallerydlg figcaption", [
    item.caption && item.caption,
  ]);
}

const urlParams = new URLSearchParams(window.location.search);
const set = urlParams.get('set');
const entry = urlParams.get('entry');

if (set && entry) {
  display_item(set, entry);
  DOM("#gallerydlg").showModal();
}

on("click", ".gallery_entry", e => {
  e.preventDefault();
  display_item(e.match.closest("[data-set]").dataset.set, e.match.closest("[data-idx]").dataset.idx);
  DOM("#gallerydlg").showModal();
});

on("click", "#prev", e => {
  let set = selected_set, item = selected_item;
  do {
    if (item) --item; else {
      set = set ? set - 1 : sets.length - 1;
      item = galleries[sets[set]].photos.length - 1;
    }
    if (galleries[sets[set]].photos[item].image) break;
  } while (item != selected_item || set !== selected_set);

  display_item(set, item);

});

on("click", "#next", e => {
  let set = selected_set, item = selected_item;
  do {
    if (item < galleries[sets[set]].photos.length - 1) ++item; else {
      set = (set + 1) % sets.length;
      item = 0;
    }
    if (galleries[sets[set]].photos[item].image) break;
  } while (item != selected_item || set !== selected_set);

  display_item(set, item);
});
