(function () {
  const $addingOption = document.querySelector(".add-option");
  const $addedOptionList = document.querySelector(".voting-option-list");
  const $userOption = document.querySelector(".user-option");

  function createNewOptionUnit(content) {
    const $wrapper = document.createElement("li");
    const $newOption = document.createElement("input");
    const $button = document.createElement("button");

    $newOption.setAttribute("name", "options")
    $button.classList.add("option-delete-button");
    $newOption.value = content;
    $button.textContent = "Delete";

    $wrapper.appendChild($newOption);
    $wrapper.appendChild($button);

    return {
      wrapper: $wrapper,
      button: $button,
    };
  }

  $addingOption.addEventListener("click", function () {
    if (!$userOption.value.length) {
      return;
    }

    const { wrapper, button } = createNewOptionUnit($userOption.value);

    button.addEventListener("click", function () {
      $addedOptionList.removeChild(wrapper);
    });

    $userOption.value = "";

    $addedOptionList.appendChild(wrapper);
  });

})();
