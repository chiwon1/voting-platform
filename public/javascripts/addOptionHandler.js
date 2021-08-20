(function () {
  const $addOptionButton = document.querySelector(".add-option-button");
  const $addedOptionList = document.querySelector(".voting-option-list");
  const $inputOption = document.querySelector(".input-option");

  function createNewOptionUnit(content) {
    const $newOption = document.createElement("input");
    const $button = document.createElement("button");
    const $wrapper = document.createElement("li");

    $newOption.setAttribute("name", "options")
    $newOption.value = content;

    $button.textContent = "Delete";

    $wrapper.appendChild($newOption);
    $wrapper.appendChild($button);

    return {
      wrapper: $wrapper,
      button: $button,
    };
  }

  $addOptionButton.addEventListener("click", function () {
    if (!$inputOption.value.length) {
      return;
    }

    const { wrapper, button } = createNewOptionUnit($inputOption.value);

    button.addEventListener("click", function () {
      $addedOptionList.removeChild(wrapper);
    });

    $inputOption.value = "";

    $addedOptionList.appendChild(wrapper);
  });
})();
