// ----------------------------------------------------------
// ------------------- GLOBAL VARIABLES ---------------------
// ----------------------------------------------------------

let p1 = "Player 1"
let p1Col = 'rgb(50, 50, 255)'

let p2 = "Player 2"
let p2Col = 'rgb(255, 50, 50)'

let table = $('table tr')

let curPlayer = 1
let curName = p1
let curColor = p1Col

// ----------------------------------------------------------
// ----------------------- GAME LOGIC -----------------------
// ----------------------------------------------------------


$('h3').text(`${p1}'s turn.`)

$('button').on('click', function() {

  // finds the closest td of the clicked button (its parent)
  // and gets its index. That one is the current column
  let column = $(this).closest('td').index()

  // checks which row is the bottom-most one available for
  // that column
  let bottom = getBottomRow(column)

  // and changes the color of the target found button in the
  // intersection
  changeCSS(bottom, column, 'background-color', curColor)

  // if there is a winner, announce it, remove the 'click'
  // event of each button and return out of the current
  // event callback.
  if (winCheck()) {

    $('h1').text(`Game Over! ${curName} wins!`)
    $('h3').text(`Refresh to play again.`)
    $('button').unbind()
    return
  }

  // switch turns
  curPlayer *= -1

  if (curPlayer === 1) {
    curName = p1
    $('h3').text(`${curName}'s turn.`)
    curColor = p1Col

  } else {
    curName = p2
    $('h3').text(`${curName}'s turn.`)
    curColor = p2Col
  }
})

// ---------------------------------------------------------
// ----------------------- FUNCTIONS -----------------------
// ---------------------------------------------------------

/* Changes the CSS style by querying for the td in the
position rowIdx of the table (target row), then it gets the
button respective to the colIdx (target column). Once found,
it changes its CSS styling according to the property and
value. */
function changeCSS(rowIdx, colIdx, property, value) {

  return table.eq(rowIdx).find('td')
              .eq(colIdx).find('button')
              .css(property, value)
}


/* Returns the button's color applying the same logic to
fetch it as the one in changeCSS(). */
function getBgColor(rowIdx, colIdx) {

  return table.eq(rowIdx).find('td')
              .eq(colIdx).find('button')
              .css('background-color')
}


/* Returns the bottom-most available slot in the clicked
button's corresponding column. */
function getBottomRow(colIdx) {

  // via a reverse iteration, checks each row in the selected
  // column from bottom to top until it finds a button with
  // a white background. Once found, it returns it.
  for (let i = 5; i > -1; i--) {
    color = getBgColor(i, colIdx)
    if (color === 'rgb(255, 255, 255)')
      return i
  }
}


/* Returns True if the first parameter matches the rest
(win condition). It also makes sure that the color is not
white and it disregards non-existant columns or rows (which
would return undefined when compared) */
function isMatch(chip1, chip2, chip3, chip4) {

  return (chip1 === chip2 && chip1 === chip3 && chip1 === chip4 &&
          chip1 !== 'rgb(255, 255, 255)' && chip1 !== undefined)
}


/* Loops through all the buttons in the grid and compares
their colors horizontally (aligned in rows), vertically
(aligned in columns) and diagonally. If four of the same
non-white color are lined up in any way, it returns true. */
function winCheck() {

  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 4; j++) {

      // checks for a color match on the right-most
      // neighborhood of the current button
      if (isMatch(
          getBgColor(i,j), getBgColor(i,j+1),
          getBgColor(i,j+2), getBgColor(i,j+3)
      ))
        return true
    }
  }

  // vertical win condition check
  for (var j = 0; j < 7; j++) {
    for (var i = 0; i < 3; i++) {

      if (isMatch(
          getBgColor(i,j), getBgColor(i+1,j),
          getBgColor(i+2,j), getBgColor(i+3,j)
      ))
        return true
    }
  }

  // horizontal win condition check
  for (var j = 0; j < 5; j++) {
    for (var i = 0; i < 7; i++) {

      if (isMatch(
            getBgColor(i,j), getBgColor(i+1,j+1),
            getBgColor(i+2,j+2), getBgColor(i+3,j+3)) ||
         isMatch(
            getBgColor(i,j), getBgColor(i-1,j+1),
            getBgColor(i-2,j+2), getBgColor(i-3,j+3))
      )
        return true
    }
  }
}
