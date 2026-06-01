const steps = [
    {
        tag: "Підберіть оптимальний варіант гігієни",
        progress: 20,
        title: "Що вас цікавить найбільше?",
        description: "Почнемо з формату запиту, щоб одразу зрозуміти, що вам потрібно.",
        hint: "Оберіть один варіант і натисніть «Далі».",
        options: [
            {
                value: "Професійне чищення зубів",
                description: "Ультразвук + Air Flow, видалення каменю і нальоту",
                image: "assets/quiz-dental/service-cleaning.jpg",
            },
            {
                value: "Чищення + відбілювання",
                description: "Комплекс гігієни з ефектом освітлення емалі",
                image: "assets/quiz-dental/service-whitening.jpg",
            },
            {
                value: "Інше",
                description: "Потрібна консультація щодо варіантів",
                image: "assets/quiz-dental/service-consultation.jpg",
            },
        ],
    },
    {
        tag: "Уточнимо деталі",
        progress: 60,
        title: "Коли востаннє ви були у стоматолога на гігієні?",
        description: "Це допоможе нам підібрати правильний протокол процедури.",
        hint: "Оберіть один варіант і натисніть «Далі».",
        options: [
            {
                value: "Менше 6 місяців тому",
                description: "Планова підтримуюча гігієна",
                image: "assets/quiz-dental/interval-care.jpg",
            },
            {
                value: "6–12 місяців тому",
                description: "Стандартне чищення з оглядом",
                image: "assets/quiz-dental/interval-standard.jpg",
            },
            {
                value: "Більше року тому",
                description: "Комплексна гігієна з детальним оглядом",
                image: "assets/quiz-dental/interval-detailed.jpg",
            },
            {
                value: "Не пам'ятаю / ніколи не робив(ла)",
                description: "Первинна консультація + повна гігієна",
                image: "assets/quiz-dental/hero-consultation.jpg",
            },
        ],
    },
    {
        tag: "Останній крок",
        progress: 80,
        title: "Що для вас найважливіше при виборі клініки?",
        description: "Щоб ми одразу підготували для вас найкращу пропозицію.",
        hint: "Оберіть один варіант і натисніть «Далі».",
        options: [
            {
                value: "Ціна",
                description: "Хочу найвигідніший варіант",
                image: "assets/quiz-dental/estimate-tablet.jpg",
            },
            {
                value: "Швидкість",
                description: "Хочу потрапити якнайшвидше",
                image: "assets/quiz-dental/priority-speed.jpg",
            },
            {
                value: "Якість і безболісність",
                description: "Розповімо про протокол і обладнання",
                image: "assets/quiz-dental/priority-quality.jpg",
            },
            {
                value: "Все разом",
                description: "Хочу зрозуміти, що підходить мені",
                image: "assets/quiz-dental/priority-all-in.jpg",
            },
        ],
    },
];

const finalStep = {
    tag: "Майже готово!",
    title: "Ваш персональний прорахунок готовий",
    description:
        "Залиште номер телефону — і ми передзвонимо протягом 15 хвилин, щоб узгодити деталі та зручний час.",
    button: "Отримати прорахунок",
    privacy: "Ми не надсилаємо спам. Лише один дзвінок щодо вашого запиту.",
};

const quizContent = document.getElementById("quizContent");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const quizActions = document.getElementById("quizActions");
const successModal = document.getElementById("successModal");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");
const quizCard = document.querySelector(".quiz-card");

let currentStep = 0;
let answers = steps.map(() => "");
let isSubmitting = false;

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function renderQuestion() {
    setQuizActionsVisible(true);

    const step = steps[currentStep];
    const optionsMarkup = step.options
        .map((option) => {
            const isSelected = answers[currentStep] === option.value;
            const selectedClass = isSelected ? " is-selected" : "";

            return `
                <button
                    class="quiz-option${selectedClass}"
                    type="button"
                    data-option="${escapeHtml(option.value)}"
                    aria-pressed="${isSelected}"
                >
                    <span class="option-art">
                        <img src="${escapeHtml(option.image)}" alt="" loading="lazy" />
                    </span>
                    <span class="option-copy">
                        <strong>${escapeHtml(option.value)}</strong>
                        <span>${escapeHtml(option.description)}</span>
                    </span>
                </button>
            `;
        })
        .join("");

    quizContent.innerHTML = `
        <article class="quiz-step" aria-labelledby="quiz-title">
            <p class="quiz-step__tag">${escapeHtml(step.tag)}</p>
            <h3 id="quiz-title">${escapeHtml(step.title)}</h3>
            <p class="quiz-step__description">${escapeHtml(step.description)}</p>
            <div class="quiz-options">${optionsMarkup}</div>
            <p class="quiz-hint">${escapeHtml(step.hint)}</p>
        </article>
    `;
}

function renderForm() {
    setQuizActionsVisible(false);

    const summaryMarkup = steps
        .map(
            (step, index) => `
                <li>
                    <strong>${index + 1}.</strong>
                    <span>${escapeHtml(step.title)} — ${escapeHtml(answers[index])}</span>
                </li>
            `,
        )
        .join("");

    quizContent.innerHTML = `
        <section class="quiz-form" aria-labelledby="quiz-title">
            <p class="quiz-step__tag">${escapeHtml(finalStep.tag)}</p>
            <h3 id="quiz-title">${escapeHtml(finalStep.title)}</h3>
            <p class="quiz-step__description">${escapeHtml(finalStep.description)}</p>

            <div class="quiz-form__summary">
                <strong>Ваші відповіді</strong>
                <ul>${summaryMarkup}</ul>
            </div>

            <form id="leadForm" novalidate>
                <div class="quiz-form__grid">
                    <div class="field field--wide">
                        <label for="phone">Ваш номер телефону</label>
                        <input id="phone" name="phone" type="tel" placeholder="+380 XX XXX XX XX" required />
                    </div>

                    <div class="field field--wide">
                        <label for="name">Ваше ім'я <span>(необов'язково)</span></label>
                        <input id="name" name="name" type="text" placeholder="Як до вас звертатись" />
                    </div>
                </div>

                <div class="quiz-form__footer">
                    <div class="quiz-form__buttons">
                        <button class="quiz-nav quiz-nav--ghost" id="formBackButton" type="button">Назад</button>
                        <button class="form-submit" id="submitButton" type="submit">${escapeHtml(finalStep.button)}</button>
                    </div>
                    <p class="quiz-form__privacy">${escapeHtml(finalStep.privacy)}</p>
                    <p class="quiz-status" id="formStatus" aria-live="polite"></p>
                </div>
            </form>
        </section>
    `;

    const leadForm = document.getElementById("leadForm");
    const formBackButton = document.getElementById("formBackButton");
    const status = document.getElementById("formStatus");

    status.textContent = "";
    leadForm.addEventListener("submit", handleSubmit);
    formBackButton.addEventListener("click", () => {
        currentStep = steps.length - 1;
        render({ syncViewport: true });
    });
}

function syncSelectedOption() {
    const selectedValue = answers[currentStep];

    quizContent.querySelectorAll("[data-option]").forEach((button) => {
        const isSelected = button.dataset.option === selectedValue;
        button.classList.toggle("is-selected", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
    });
}

function setQuizActionsVisible(isVisible) {
    quizActions.hidden = !isVisible;
    quizActions.style.display = isVisible ? "" : "none";
}

function syncQuizViewport() {
    if (!(quizCard instanceof HTMLElement)) {
        return;
    }

    requestAnimationFrame(() => {
        const cardTop = quizCard.getBoundingClientRect().top;
        const comfortableTopOffset = 16;
        const maxVisibleTop = Math.max(comfortableTopOffset, window.innerHeight * 0.14);

        if (cardTop >= comfortableTopOffset && cardTop <= maxVisibleTop) {
            return;
        }

        window.scrollTo({
            top: Math.max(0, window.scrollY + cardTop - comfortableTopOffset),
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        });
    });
}

function updateProgress() {
    if (currentStep < steps.length) {
        const step = steps[currentStep];

        progressText.textContent = `Питання ${currentStep + 1} / ${steps.length} — Прогрес: ${step.progress}%`;
        progressFill.style.width = `${step.progress}%`;
        nextButton.textContent = currentStep === steps.length - 1 ? "До фіналу" : "Далі";
        nextButton.disabled = !answers[currentStep];
        prevButton.disabled = currentStep === 0;
        prevButton.hidden = currentStep === 0;
    } else {
        progressText.textContent = "Фінальний екран — Прогрес: 100%";
        progressFill.style.width = "100%";
        prevButton.hidden = true;
        setQuizActionsVisible(false);
    }
}

function render({ syncViewport = false } = {}) {
    if (currentStep < steps.length) {
        renderQuestion();
    } else {
        renderForm();
    }

    updateProgress();

    if (syncViewport) {
        syncQuizViewport();
    }
}

function validatePhone(value) {
    const digitsOnly = value.replace(/\D/g, "");
    return digitsOnly.length >= 10;
}

async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
        return;
    }

    const form = event.currentTarget;
    const status = document.getElementById("formStatus");
    const submitButton = document.getElementById("submitButton");
    const formData = new FormData(form);
    const payload = {
        name: String(formData.get("name") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        comment: "",
        answers: steps.map((step, index) => ({
            question: step.title,
            answer: answers[index],
        })),
        submittedAt: new Date().toISOString(),
        source: "dental-hygiene-lviv-quiz",
    };

    if (!validatePhone(payload.phone)) {
        status.textContent = "Вкажіть коректний номер телефону.";
        return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    status.textContent = "Надсилаємо заявку...";

    try {
        const requestBody = new FormData();
        requestBody.append("name", payload.name);
        requestBody.append("phone", payload.phone);
        requestBody.append("comment", payload.comment);
        requestBody.append("source", payload.source);
        requestBody.append("submitted_at", payload.submittedAt);
        requestBody.append("answers_json", JSON.stringify(payload.answers));
        requestBody.append(
            "answers_text",
            payload.answers.map((item, index) => `${index + 1}. ${item.question}: ${item.answer}`).join("\n"),
        );

        const response = await fetch("send.php", {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
            body: requestBody,
        });
        const result = await response.json().catch(() => ({ ok: response.ok }));

        if (!response.ok || !result.ok) {
            throw new Error("request_failed");
        }

        form.reset();
        openModal();
        answers = steps.map(() => "");
        currentStep = 0;
        render();
    } catch (error) {
        status.textContent = "Не вдалося надіслати заявку. Спробуйте ще раз трохи пізніше.";
    } finally {
        isSubmitting = false;
        submitButton.disabled = false;
    }
}

function openModal() {
    successModal.classList.add("is-open");
    successModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    successModal.classList.remove("is-open");
    successModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

nextButton.addEventListener("click", () => {
    if (currentStep >= steps.length || !answers[currentStep]) {
        return;
    }

    currentStep += 1;
    render({ syncViewport: true });
});

prevButton.addEventListener("click", () => {
    if (currentStep === 0) {
        return;
    }

    currentStep -= 1;
    render({ syncViewport: true });
});

quizContent.addEventListener("click", (event) => {
    const optionButton = event.target.closest("[data-option]");

    if (!(optionButton instanceof HTMLElement) || !quizContent.contains(optionButton) || currentStep >= steps.length) {
        return;
    }

    const selectedValue = optionButton.dataset.option ?? "";

    if (!selectedValue || answers[currentStep] === selectedValue) {
        return;
    }

    answers[currentStep] = selectedValue;
    syncSelectedOption();
    updateProgress();
});

closeModalButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && successModal.classList.contains("is-open")) {
        closeModal();
    }
});

render();
