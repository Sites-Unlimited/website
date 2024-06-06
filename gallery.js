import {choc, set_content, on, DOM, fix_dialogs} from "https://rosuav.github.io/choc/factory.js";
const {BLOCKQUOTE, BUTTON, DIALOG, DIV, FIGCAPTION, FIGURE, H2, LI, P, SECTION, UL} = choc; //autoimport

let selected_item = 0;
let selected_set = 0;

const sets = Object.keys(galleries);
sets.sort((a, b) => galleries[a].sequence - galleries[b].sequence); // sort for by category
console.log(sets);

document.body.appendChild(DIALOG({id: "gallerydlg"}, [
  DIV({id: "dlgcontent"}, [
    DIV({id: "dialog_header"}, [BUTTON({type: "button", class: "dialog_cancel", title: "close slideshow"}, 'x')]),
    DIV({id: "slides_nav"}, [BUTTON({id: "prev", title: "previous image"}, "<<"), BUTTON({id: "next", title: "next image"}, ">>")]),
    DIV({class: 'gallery-image'})]),
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

function non_boudoir(set) {
  return [P(galleries[set].description),
    DIV({class: "gallery_set"}, galleries[set].photos.map((item, idx) => item.image &&
      DIV(
        {"data-idx": idx, class: "gallery_entry"},
        item.caption ? FIGURE([gallery_image(item), FIGCAPTION(item.caption)]) : gallery_image(item)
      ))),
    P(UL(galleries[set].photos.map((item, idx) => !item.image &&
      LI([
        item.notes && BLOCKQUOTE(item.notes),
      ]))))];
}

function boudoir(set) {
  return [P("Click the image below to view to boudoir gallery, which is suitable for adults."),
    DIV({class: "gallery_set"}, galleries[set].photos.filter((item) => item.image.url.endsWith("KN1A9047-2-2.jpg")).map((item, idx) => item.image &&
      DIV(
        {"data-idx": idx, class: "gallery_entry"},
        item.caption ? FIGURE([gallery_image(item), FIGCAPTION(item.caption)]) : gallery_image(item)
      ))),
    P(UL(galleries[set].photos.map((item, idx) => !item.image &&
      LI([
        item.notes && BLOCKQUOTE(item.notes),
      ]))))];
}

//if (!set === "boudoir") {
{
  set_content("#gallery",
    sets.map((set, idx )=> galleries[set] && SECTION({'data-set': idx}, [
      H2({id: set}, set.replace(/_/g, " ")),
      (set !== "boudoir") && non_boudoir(set),
      (set === "boudoir") && boudoir(set),
    ]))
  );
}

function display_item(set, idx) {
  selected_item = +idx; // cast as number
  selected_set = +set;
  const item = galleries[sets[set]].photos[idx];
  console.log(item);
  DOM("#gallerydlg .gallery-image").replaceWith(gallery_image(item));
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
      item = 0;
    }
    if (galleries[sets[set]].photos[item].image) break;
  } while (item != selected_item || set !== selected_set);

  display_item(set, item);
});
