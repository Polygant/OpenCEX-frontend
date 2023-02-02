import localConfig from "~/local_config";

const support = {
  ru: {
    welcome: "Добро пожаловать в службу поддержки",
    create_ticket: "Создать тикет",
    contacts: "Наши контакты",
    general_questions: {
      title: "Общие вопросы",
      items: {
        title1: `Как работает ${localConfig.project_title}?`,
        content1: `<p>${localConfig.project_title} — многофункциональная экосистема, которая предоставляет пользователям возможность продавать, покупать, обменивать и хранить криптовалюту, а также зарабатывать на стейкинге и участвовать в токенсейлах. Продавцы и покупатели могут проводить между собой торговые операции на те средства, которые они размещают в кошельках своего аккаунта.</p>
          <p>${localConfig.project_title} не торгует и не устанавливает цены на бирже, а лишь обеспечивает удобство и безопасность операций. Пользователи покупают и продают криптовалюты самостоятельно. Экосистема <a href="/account/fees" target='_blank'>берет комиссию</a> за совершенные ими сделки.
          </p>`,
        title2: `Как начать торговать на ${localConfig.project_title}?`,
        content2: `Для начала зарегистрируйте учетную запись.
          <p>Затем пополните свой счет одним из способов, доступных на странице «<a href='/account/wallet' target='_blank'>Кошелек</a>». После внесения средств сможете на них покупать и продавать криптовалюту. В зависимости от вашей цели воспользуйтесь простым или расширенным интерфейсом.</p>`,
        title3: `Безопасно ли пользоваться ${localConfig.project_title}?`,
        content3: `<p>На ${localConfig.project_title} задействованы современные средства защиты. Все ваши криптоактивы и личные данные надежно защищены. В разделе <a href="/account/support?c=security" target='_blank'>БЕЗОПАСНОСТЬ АККАУНТА</a> ознакомьтесь с настройками безопасности, которые помогут защитить ваш аккаунт на ${localConfig.project_title}.
          </p>`,
        title4: "Как обратиться в техподдержку?",
        content4: `<p>Нажмите кнопку с именем аккаунта (в виде вашего имейла) и в выпадающем контекстном меню выберите «Поддержка». На странице Поддержки вы можете ознакомиться с описанием основных разделов и функций ${localConfig.project_title}. Если не нашли ответа на свой вопрос, то можете индивидуально задать его технической поддержке. Нажмите кнопку Help в нижнем правом углу страницы. Откроется всплывающая форма, в которой нужно указать ваше имя, имейл, тему обращения и описать возникшую проблему. После заполнения необходимых полей нажмите кнопку Send. Техническая поддержка ответит вам в течение 24 часов.</p>`,
      },
    },
    security: {
      title: "Безопасность аккаунта",
      items: {
        title1: "Базовые правила безопасности",
        content1: `<ul class="dotted-list">
            <li>Создайте и используйте надежный пароль.</li>
            <li>Не заходите в аккаунт через непроверенные устройства.</li>
            <li>Всегда выходите из аккаунта по завершении работы с ${localConfig.project_title}.</li>
            <li>Никому не сообщайте имя аккаунта и пароль от него.</li>
            <li>Подключите дополнительные средства защиты аккаунта.</li></ul>`,
        title2: `Смена пароля`,
        content2: `<p>Пароль от аккаунта можно изменить на странице «Настройки». Для повышения безопасности создайте сложный пароль. Если вы забыли пароль, то на странице входа в аккаунт нажмите на «Восстановление пароля» и укажите свой имейл. Вам будет отправлено письмо со ссылкой, пройдя по которой вы сможете задать новый пароль для аккаунта. После восстановления пароля вывод средств будет заблокирован на 72 часа в целях безопасности.</p>`,
        title3: "Двухфакторная аутентификация",
        content3: `<p>Если вы хотите защитить свой аккаунт с помощью двухфакторной аутентификации, то нажмите кнопку «Включить» в строке 2FA на странице «Настройки». Откроется окно с QR-кодом и ссылкой на мобильное приложение Google Authenticator. Установите его на телефон, отсканируйте QR-код с экрана ПК, после чего в приложении появится код аутентификации для вашего аккаунта на ${localConfig.project_title}. Для сохранения настроек нажмите «Далее», введите код из приложения и нажмите «Сохранить». Теперь вы будете заходить в аккаунт через включенный 2FA.</p>`,
        title4: "Подтверждение вывода по имейлу",
        content4: `<p>Для сохранности ваших средств при выводе ${localConfig.project_title} требует подтверждение этой операции. После создания заявки на вывод вам будет отправлено письмо со ссылкой, по которой нужно пройти, чтобы подтвердить заявку. Вы можете отменить вывод до подтверждения заявки по имейлу, пройдя по другой ссылке в этом же письме или нажав на «Отмену» в блоке «История кошелька».</p>`,
      },
    },
    settings: {
      title: "Настройки",
      items: {
        title1: "Описание страницы настроек",
        content1: `<p>Чтобы попасть на страницу настроек, нажмите на имя аккаунта (в виде вашего имейла) рядом с «МЕНЮ» и выберите «Настройки». Страница состоит из 3 блоков:</p>
          <ol><li>Настройки.</li><li>Личная информация.</li><li>Изменение пароля.</li></ol>`,
        title2: "Блок «Настройки»",
        content2: `<p>В этом блоке можно улучшить безопасность, включив двухфакторную аутентификацию (2FA), изменить продолжительность бездействия, а также переключить интерфейс.</p>
          <p>Включение 2FA подробно описано в разделе  <a href='/account/support?c=security' rel='noopener noreferrer nofollow' target='_blank'>БЕЗОПАСНОСТЬ АККАУНТА</a>.</p>
          <p>Изменение времени бездействия задает количество минут, в течение которых вы будете оставаться залогиненным на ${localConfig.project_title} с момента последнего действия. Увеличив продолжительность бездействия, можно дольше пребывать на сайте, но так вы рискуете безопасностью аккаунта в случае, если злоумышленник получит доступ к вашему устройству.</p>
          <p>Переключение интерфейса может понадобиться для того, чтобы изменить вид, отображаемый по умолчанию при первом входе на ${localConfig.project_title}. Доступны простой и расширенный интерфейсы. Простой интерфейс подойдет для быстрой покупки или продажи криптовалют. Расширенный интерфейс нужен для полномасштабного трейдинга.</p>`,
        title3: "Блок «Личная информация»",
        content3: `<p>В этом блоке отображаются ваши личные данные, указанные при регистрации, а также подтвержденный номер телефона. Вы можете изменить личные данные, обратившись в техническую поддержку.</p>`,
        title4: "Блок «Изменение пароля»",
        content4:
          "<p>Подробное описание этого блока читайте в разделе <a rel='noopener noreferrer nofollow' href='/account/support?c=security' target='_blank'>БЕЗОПАСНОСТЬ АККАУНТА</a>.</p>",
      },
    },
    wallet: {
      title: "Кошелек",
      items: {
        title1: "Устройство кошелька",
        content1: `Страница кошелька состоит из следующих блоков: <ul class="dotted-list"><li>Список поддерживаемых криптовалют и их балансы на вашем аккаунте. Подробнее о способах пополнения и снятия средств на ${localConfig.project_title} читайте в разделе <a rel='noopener noreferrer nofollow' href='/account/support?c=in_out' target='_blank'>ВВОД/ВЫВОД</a>.</li>
          <li>История кошелька.</li></ul>`,
        title2: "История кошелька",
        content2: `<p>В этом блоке отображаются все пополнения и снятия с вашего аккаунта. Все операции ввода/вывода учитываются здесь с указанием дат, сумм, статусов и другой детальной информации. Через этот блок можно заново отправить письмо с подтверждением или отменить вывод, если он еще не был подтвержден по имейлу.</p>`,
      },
    },
    in_out: {
      title: "Ввод/Вывод",
      items: {
        title1: `Как пополнить аккаунт на ${localConfig.project_title}?`,
        content1: `<p>Аккаунт можно пополнить криптовалютами, переведя их на соответствующие адреса ваших биржевых кошельков. Для этого перейдите на страницу Кошелька и нажмите кнопку «Депозит» напротив вводимой криптовалюты.
          </p><p>В открывшемся окне сгенерируйте адрес, на который вам надо будет перевести выбранную криптовалюту. Нажмите «Создать» — появится адрес для пополнения вашего аккаунта криптовалютой. Такие адреса вида 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa генерируются для каждой из поддерживаемых криптовалют.
          </p>`,
        title2: `Как вывести средства с ${localConfig.project_title}?`,
        content2: `<p>Чтобы вывести средства, нажмите кнопку «Вывод» напротив нужной криптовалюты и выберите способ из контекстного меню. Заполните появившуюся форму, введя сумму и криптовалютный адрес. Там под зеленой кнопкой указываются минимальная и максимальная суммы снятия, а также время обработки заявки. После того как вы ввели необходимые данные, нажмите зеленую кнопку «Вывод». Вам на имейл будет отправлено письмо для подтверждения заявки на вывод. Пройдите по ссылке, чтобы подтвердить заявку.</p>`,
      },
    },
    exchange: {
      title: "Торговля",
      items: {
        title1: `Способы покупки/продажи криптовалюты на ${localConfig.project_title}`,
        content1: `<p>Команда ${localConfig.project_title} создала два интерфейса для покупки и продажи криптовалют: простой и расширенный.</p>
          <p>Простой интерфейс, он же Обменник, поможет вам купить или продать криптовалюту максимально удобно и быстро. Для этого не понадобятся специальные знания в области трейдинга. Подробнее в разделе <a href="/account/support?c=fast" target="_blank">ОБМЕННИК</a>.</p>
          <p>Расширенный интерфейс, он же Биржа, — это полноценная торговая страница с профессиональными инструментами для трейдинга. Она состоит из 7 блоков:</p>
          <ol>
          <li>Слева — список ордеров на покупку и продажу.</li>
          <li>В центре сверху — график изменения цены.</li>
          <li>В центре ниже — блок создания ордеров.</li>
          <li>Справа сверху — блок выбора валютных пар, отображающий текущую цену, 24-часовой объем торгов и процентное изменение цены.</li>
          <li>Справа ниже — блок кошелька, отображающий все ваши ненулевые балансы.</li>
          <li>Внизу слева — список ваших открытых и исполненных ордеров.</li>
          <li>Внизу справа — ваши последние сделки в выбранной валютной паре.</li>
          </ol>
          <p>В блоке выбора валютных пар есть вкладки с указанием криптовалют, таких как BTC и USDT. Нажав на одну из них, вы увидите, какие криптовалюты можно купить за нее. Выберите нужную валютную пару. Страница обновится — появится график выбранной валютной пары, список ордеров и история сделок по ней.</p>`,
        title2: "Постановка ордера на торговой странице",
        content2: `<p>Прямо под графиком расположен блок создания ордера. В нем нужно указать цену и количество криптовалюты, которую вы хотите купить или продать. Вы можете заполнить эти поля вручную или выбрать цену и количество из списка ордеров, которые перечислены в левом блоке. Нажмите там на строку с ценой и количеством, которая вас устраивает, и поля создания ордера заполнятся автоматически. Останется только нажать на соответствующую кнопку под заполненным полем, чтобы ордер исполнился.
          </p><p>На главной странице появляются уведомления обо всех совершенных действиях, связанных с вашими ордерами. Если при покупке вы указали цену ниже, чем самое выгодное предложение, то ваш ордер окажется в списке ордеров на покупку и будет находиться там, пока его не исполнит другой пользователь. Он будет выделен жирным шрифтом, чтобы вы сразу могли найти его в списке ордеров.
          </p><p>Вы можете отредактировать или отменить выставленный ордер. В нижнем блоке «Открытые ордера» выводится список ваших активных ордеров, где напротив каждого есть значки отмены и редактирования. Чтобы отменить ордер, нажмите на красный крестик. А чтобы отредактировать ордер, нажмите на желтый значок редактирования, в появившемся окне измените цену и количество, затем нажмите «Обновить» — и ваш ордер изменится.
          </p>`,
        title3: `Видеообзор: как торговать криптовалютами на ${localConfig.project_title}`,
        content3: `<iframe width="560" height="315" src="https://www.youtube.com/embed/JfkKBSrZZWk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
      },
    },
    fast: {
      title: "Обменник",
      items: {
        title1: "Что представляет собой Обменник?",
        content1: `<p>Обменник — это облегченный интерфейс для покупки и продажи криптовалют. Если вы не трейдер, то можете воспользоваться этим простым и удобным интерфейсом. Для этого выберите «<a rel='noopener noreferrer nofollow' href='/account/quick-swap' target='_blank'>Обменник</a>» через главное Меню или переключите интерфейс в настройках, чтобы он автоматически открывался после входа на ${localConfig.project_title}.`,
        title2: `Как просто купить или продать криптовалюту через Обменник?`,
        content2: `<p>На странице облегченного обмена представлены 3 блока:</p>
          <ol>
          <li>Основной — для выбора криптовалют, которые вы отдаете и получаете, ввода количества и совершения обмена.</li>
          <li>«Кошелек» (слева) — для отображения балансов ваших криптовалют.</li>
          <li>«История обменов» (внизу) — для учета всех ваших операций по обмену с указанием даты, количества отданной и полученной валюты, цены.</li>
          </ol>
          <p>Чтобы совершить обмен, нажмите на ссылку «Купить» или «Продать» в строке интересующей вас криптовалюты. Либо выберите имеющуюся криптовалюту напротив поля «Отдаю», а напротив поля «Получаю» выберите ту, которую хотите получить взамен. Затем введите количество монет (можно дробное) в поле «Отдаю», и тогда во втором поле появится сумма, которую вы получите, нажав кнопку «Обменять». Вы также можете использовать кнопки с процентами 25%, 50%, 75% и 100%, нажав на которые поле «Отдаю» автоматически заполнится на указанный процент имеющейся у вас криптовалюты.</p>
          <p>Фактическая сумма может отличаться от указанной в поле «Получаю», так как обмен происходит путем исполнения пользовательских ордеров из списка ордеров с основной страницы торгов. А они могут изменяться в момент проведения сделки. После обмена вы увидите уведомление и вашу сделку в блоке «История обменов».</p>
          `,
      },
    },
    other: {
      title: "Вопросы и ответы",
      items: {
        title1: "Что делать, если я забыл пароль?",
        content1: `<p>Если вы забыли пароль, то на странице входа в аккаунт нажмите на «Восстановление пароля» и укажите свой имейл. Вам будет отправлено письмо со ссылкой, пройдя по которой вы сможете задать новый пароль для аккаунта. После восстановления пароля вывод средств будет заблокирован на 72 часа в целях безопасности.</p>`,
        title2: "Почему не подходит код 2FA?",
        content2: `<p>Код двухфакторной аутентификации (2FA) может не подходить по следующим причинам:</p>
          <ul class="dotted-list">
          <li>Время на компьютере не совпадает со временем на телефоне. Включите автоматическую синхронизацию времени в настройках телефона.</li>
          <li>Время не синхронизировано в приложении Google Authenticator. В настройках приложения выберите пункт «Коррекция времени для кодов» и нажмите «Синхронизация».</li>
          <li>На телефоне включены VPN или proxy. Попробуйте авторизоваться с выключенными VPN и proxy.</li>
          </ul>
          `,
        title3: "Что делать, если я удалил приложение 2FA или код из него?",
        content3:
          "<p>Если вы удалили приложение Google Authenticator или удалили код 2FA из него, а в вашем аккаунте включена 2FA, обратитесь в поддержку. Для создания тикета нажмите кнопку Help в нижнем правом углу экрана.</p>",
        title4:
          "Что делать, если я ошибся при указании криптовалютного адреса для вывода?",
        content4: `<p>Если вы указали ошибочный криптовалютный адрес для вывода, и он перешел в статус «Выполнено», то отменить вывод или вернуть криптовалюту невозможно в силу технических особенностей блокчейна.</p>
          <p>Если вывод находится в статусе «Ожидает отправки», то обратитесь в поддержку.</p>
          <p>Если вывод находится в статусе «Ожидает подтверждения», то вы сами можете нажать кнопку «Отменить» в строке вывода в блоке «История кошелька». После этого создайте новую заявку на вывод по верному адресу.</p>`,
        title5:
          "Что делать, если я предоставил неверные личные данные при регистрации?",
        content5:
          "<p>Обратитесь в поддержку. В тикете укажите верные данные и приложите документы, подтверждающие достоверность персональных данных.</p>",
        title6: "Что делать, если обмен не происходит из-за ошибки?",
        content6:
          "<p>Обмен может не происходить, если не хватает средств на балансе. Попробуйте уменьшить сумму обмена или обратитесь в поддержку. В тикете укажите тип ошибки, который всплывает в верхнем правом углу.</p>",
        title7: "Почему я сталкиваюсь с ошибкой при постановке ордера?",
        content7: `<p>Ошибка при постановке ордера может произойти в таких случаях:</p>
          <ul class="dotted-list">
          <li>Несоответствие лимитам.</li>
          <li>Не все поля заполнены при создании ордера.</li>
          <li>Не хватает средств на вашем балансе.</li>
          </ul>
          <p>Причина ошибки при постановке ордера выводится в верхнем правом углу. Прочитайте это уведомление и попробуйте изменить сумму или правильно заполнить поля.</p>
          <p>Если вышеприведенные способы не помогли, обратитесь в поддержку.</p>`,
        title8:
          "Почему не приходит письмо со ссылкой на активацию аккаунта или вывода?",
        content8: `<p>Проблемы с доставкой писем могут возникать в следующих случаях:</p>
          <ul class="dotted-list">
          <li>Вы указали неверный имейл. Зарегистрируйтесь заново, указав верный имейл.</li>
          <li>Письмо попало в спам. Проверьте папку «Спам», и если письмо оказалось там, то пометьте его как неспамное, чтобы наши письма приходили во «Входящие» и вы их сразу замечали.</li>
          </ul>
          <p>Если не удалось решить проблему, обратитесь в поддержку. А если вам не приходит письмо с подтверждением вывода, то отправьте его заново, нажав кнопку «Повторно отправить письмо» в строке с выводом в блоке «История кошелька».</p>`,
        title9:
          "Почему не поступила криптовалюта, если вывод числится исполненным?",
        content9: `<p>Задержки при выводе могут возникать в случае перегруженности блокчейн-сети. Из-за очереди на подтверждение транзакций майнерам может понадобиться до нескольких часов. Чтобы узнать о статусе перевода, нажмите Info в строке вывода в блоке «История кошелька».</p>`,
      },
    },
  },
  en: {
    welcome: "Welcome to support center",
    create_ticket: "Create ticket",
    contacts: "Contact Us",
    general_questions: {
      title: "Common Questions",
      items: {
        title1: `How does ${localConfig.project_title} work?`,
        content1: `<p>${localConfig.project_title} is a versatile ecosystem that enables users to buy, sell, exchange, and store cryptocurrency, as well as earn through staking and participating in token sales. Buyers and sellers can transact using funds that they deposit into their accounts.
          </p><p>${localConfig.project_title} does not trade, nor does it fix prices on the exchange. It simply ensures the convenience and security of transactions. Users buy and sell cryptocurrency completely independently. The ecosystem <a href="/account/fees" target="_blank">charges a commission</a> on each transaction it facilitates.
          </p>`,
        title2: `How do I start trading with ${localConfig.project_title}?`,
        content2: `<p>First, you need to sign up. 
          <p>Then, top up your account using any of the payment methods available on the '<a href="/account/wallet" target='_blank'>Wallet</a>' page. Once you have deposited funds, you can use them to start trading cryptocurrency. Use the simplified or advanced interface according to your goals on the platform.</p>
          `,
        title3: `Is it safe to use ${localConfig.project_title}?`,
        content3: `<p>${localConfig.project_title} makes use of cutting-edge security technology to protect your personal data and crypto assets. Refer to the <a href="/account/support?c=security" target='_blank'>ACCOUNT SECURITY</a> chapter to read more about security settings that will help better protect your ${localConfig.project_title} account.</p>`,
        title4: `How can I contact the support desk?`,
        content4: `<p>Click the button containing your account name (email) and select 'Support' in the dropdown menu. On the 'Support' page you will find information about ${localConfig.project_title} various sections and functions. If you have read this information and your question still hasn’t been answered, get in touch with our support desk by clicking the ‘Help’ button in the bottom right corner of the page. A pop-up enquiry form will open. Enter your name, email address, and the subject and description of your enquiry in the spaces provided. Once you have filled out the required fields, click 'Send'. Our tech support team will get back to you within 24 hours.
          </p>`,
      },
    },
    security: {
      title: "Account Security",
      items: {
        title1: "Essential security measures",
        content1: `<ol>
          <li>Create and use a strong password.</li>
          <li>Do not log in to your account from untrusted devices.</li>
          <li>Always log out when you have finished a session with ${localConfig.project_title}.</li>
          <li>Do not tell anyone your login details.</li>
          <li>Activate additional security features.</li>
          </ol>`,
        title2: "Password change",
        content2: `<p>You can reset your account password on the '<a rel='noopener noreferrer nofollow' href='/account/settings' target='_blank'>Settings</a>' page. For increased security, create a strong password. If you have forgotten your password, click ‘Password recovery’ on the login page and enter your email. A link will be sent to your email which will allow you to create a new password. In order to protect your account, the withdrawal function will be disabled for 72 hours after your password is reset.</p>`,
        title3: "Two-factor authentication",
        content3: `<p>If you wish to protect your account with two-factor authentication, click the ‘Turn ON’ button in the 2FA line on the ‘Settings’ page. You will see a QR code and a link to the Google Authenticator mobile app. Install the app onto your mobile device and then use it to scan the QR code from your computer screen. The authentication code for your ${localConfig.project_title} account will appear in the app. To save your settings, click ‘Next,’ enter the authentication code from the app into the space provided and then click ‘Save.’ From now on you will log in to your account using 2FA.</p>`,
        title4: "Confirming withdrawals via email",
        content4: `<p>The confirmation process allows ${localConfig.project_title} to keep your funds secure during withdrawals. Once you submit a withdrawal request, you will receive an email containing a link. Follow this link to confirm your intent to withdraw. It is possible to cancel a withdrawal before confirming the request via email. To do so, follow the appropriate link in the email you received or click ‘Cancel’ in the ‘Wallet History’ segment.</p>`,
      },
    },
    settings: {
      title: "Settings",
      items: {
        title1: "Navigating the ‘Settings’ page",
        content1: `<p>To get to the ‘Settings’ page, click on your account name (your email address) next to MENU in the top right-hand corner and select ‘Settings.’ The page contains 3 segments:
          </p>
          <ol>
          <li>Settings.</li>
          <li>Personal info.</li>
          <li>Password change.</li>
          </ol>
          `,
        title2: "Settings",
        content2: `
          <p>Here you can enhance your security by enabling two-factor authentication (2FA) and changing the duration of inactivity, as well as switch between interfaces.</p>
          <p>Refer to the <a href="/account/support?c=security" target="_blank">ACCOUNT SECURITY</a> chapter to learn how to enable 2FA.</p>
          <p>Inactivity timeout is the period of time (minutes) for which a user can be inactive before they are automatically logged out. By increasing the period of inactivity you can stay logged in for longer; however, this poses a risk to your account security should an intruder gain access to your device.</p>
          <p>Switching interfaces will change the default appearance of ${localConfig.project_title} when you log in. There are two interfaces available: simplified and advanced. The simplified interface is ideal for quickly buying or selling cryptocurrency, while the advanced interface is designed for full-scale trading.</p>
          `,
        title3: "Personal info",
        content3:
          "<p>This segment contains your personal information which you provided during registration, as well as your verified phone number. You can change your personal details by contacting our support desk.</p>",
        title4: "Password change",
        content4: `Refer to the <a rel='noopener noreferrer nofollow' href='/account/support?c=security' target='_blank'>ACCOUNT SECURITY</a> chapter to read more about this segment.`,
      },
    },
    wallet: {
      title: "Wallet",
      items: {
        title1: "Wallet structure",
        content1: `
          <p>The ‘Wallet’ page contains the following segments:</p>
          <ul class="dotted-list">
          <li>A list of supported cryptocurrencies with their respective balances on your account. For more information about the kinds of deposit and withdrawal methods available on ${localConfig.project_title}, refer to the <a href="/account/support?c=in_out" target="_blank">DEPOSIT/WITHDRAWAL</a> chapter.</li>
          <li>Wallet history.</li>
          </ul>`,
        title2: "Wallet history",
        content2:
          "<p>This segment displays all deposits and withdrawals to and from your account. Deposit and withdrawal transactions are recorded here with their respective dates, amounts, statuses, and other details. In this segment you can resend a confirmation email or cancel a withdrawal if it has not yet been confirmed by email.</p>",
      },
    },
    in_out: {
      title: "Deposit/Withdrawal",
      items: {
        title1: `How to deposit funds to ${localConfig.project_title} account`,
        content1: `<p>You can top up your account with cryptocurrencies by transferring them to the corresponding addresses of your exchange wallets. To do this, go to the ‘Wallet’ page and click ‘Deposit’ opposite the cryptocurrency you wish to deposit.
          </p><p>
          A window will open allowing you to generate an address to which to transfer your selected cryptocurrency. Click ‘Create,’ and an address for topping up your account with cryptocurrency will appear. Such addresses like 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa are generated for each of the supported cryptocurrencies.</p>
          `,
        title2: `How to withdraw funds from ${localConfig.project_title}`,
        content2: `To withdraw funds, click ‘Withdrawal’ opposite the cryptocurrency you wish to withdraw and select a method from the context menu. A form will appear which you need to fill out by entering the withdrawal amount and cryptocurrency address. Under the green button you will see the minimum and maximum withdrawal amounts, as well as the processing time of the request. After entering the required data, click the green ‘Withdrawal’ button. You will receive an email with a confirmation link. Follow it to confirm your withdrawal request.`,
      },
    },
    exchange: {
      title: "Trading",
      items: {
        title1: `Ways of buying and selling cryptocurrency with ${localConfig.project_title}`,
        content1: `
          <p>The ${localConfig.project_title} team has created two interfaces for buying and selling cryptocurrencies: Simplified and Advanced.</p>
          <p>The simplified interface (Quick Swap) can help you buy or sell cryptocurrency quickly and easily. You won’t need any specific trading knowledge. Read more in the <a href="/account/support?c=fast" target="_blank">Quick Swap</a> chapter.</p>
          <p>The advanced interface (the Exchange) is a full-fledged trading page offering a range of professional tools. It consists of 7 segments:</p>
          <ol>
          <li>On the left is the order book (to buy and sell).</li>
          <li>In the centre at the top is the price chart.</li>
          <li>In the centre below is the segment for placing orders.</li>
          <li>On the right at the top is the segment for selecting currency pairs displaying the current price, 24-hour trading volume, and price change as a percentage.</li>
          <li>On the right below is the wallet segment displaying all of your positive balances.</li>
          <li>At the bottom left is a list of your open and closed orders.</li>
          <li>At the bottom right are your recent trades with the selected currency pair.</li>
          </ol>
          <p>The segment for selecting currency pairs has tabs specifying cryptocurrencies, such as BTC and USDT. When one is selected, you will be able to see which cryptocurrencies you can use it to purchase. Select your preferred currency pair. The page will refresh and show the chart of the selected currency pair, the order book, and transaction history.</p>
          `,
        title2: "Placing an order on the trading page",
        content2: `
          <p>The order placement segment is located under the chart. There you need to enter the price and amount of cryptocurrency you wish to buy or sell. You can either fill out these fields by yourself or select the price and amount from the order book in the segment on the left. Just click on the row with the price and amount that suits you, and the order placement fields will be filled out automatically. Finally, click the button underneath the filled-out fields to execute the order.</p>
          <p>Notifications on all order-related actions appear on the main page. If you entered the price that is lower than the best available price, your order will be moved to the list of buy orders and will remain there until another user executes it. It will be marked in bold so you can easily find it in the list of orders.</p>
          <p>After placing an order, you can still edit or cancel it. In the lower ‘Open orders’ segment, the list of active orders with corresponding ‘cancel’ and ‘edit’ icons can be found. To cancel the order, click the red X. To edit the order, click the yellow icon, change the price and amount, then click ‘Update.’</p>
          `,
        title3: `Video overview: how to trade cryptocurrencies on ${localConfig.project_title}`,
        content3: `<iframe width="560" height="315" src="https://www.youtube.com/embed/JfkKBSrZZWk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
      },
    },
    fast: {
      title: "Quick Swap",
      items: {
        title1: "What is Quick Swap?",
        content1: `Quick Swap is a simplified interface for buying and selling cryptocurrency. If you are not a trader, this simple and convenient interface is for you. In order to use it, click ‘<a href="/account/quick-swap" target="_blank">Quick Swap</a>’ in the main Menu or switch the interface in Settings to make it launch automatically whenever you log in to ${localConfig.project_title}.`,
        title2: "How to buy or sell cryptocurrency easily with Quick Swap",
        content2: `
          <p>The ‘Quick Swap’ page contains 3 segments:</p>
          <ol>
          <li>The main segment is for selecting cryptocurrencies to send and receive, entering the amount, and making an exchange.</li>
          <li>The ‘Wallet’ segment (left) is for displaying the balances of your cryptocurrencies.</li>
          <li>The ‘Exchange History’ segment (bottom) is for recording all of your exchange transactions with their respective dates, amounts bought or sold, and price.</li>
          </ol>
          <p>To make an exchange, click the ‘Buy’ or ‘Sell’ link next to your chosen cryptocurrency. Alternatively, select the cryptocurrency you wish to send opposite the ‘Give’ field and select that which you wish to receive opposite the ‘Get’ field. Then, enter the amount of coins you wish to send (in fractional or whole amounts) in ‘Give.’ The amount you will receive once you have clicked ‘Exchange’ will be shown in the second field. You also can use the 25%, 50%, 75%, and 100% buttons: by clicking one of them, the ‘Give’ field will be filled out automatically with the specified percentage of the total amount of the selected cryptocurrency.</p>
          <p>The actual amount can differ from that shown in the ‘Get’ field as the exchange occurs via the execution of user orders from the order list on the main trading page. These orders can change during the process of a deal. After exchanging, you will see a notification and your transaction will be visible in the ‘Exchange History’ segment.</p>
          `,
      },
    },
    other: {
      title: "Questions & Answers",
      items: {
        title1: "What should I do if I forgot my password?",
        content1: `<p>If you have forgotten your password, click ‘Password recovery’ on the login page and enter your email. A link will be sent to your email which will allow you to create a new password. In order to protect your account, the withdrawal function will be disabled for 72 hours after your password is reset.
          </p>`,
        title2: "Why doesn’t my 2FA code work?",
        content2: `<p>The 2FA code may fail due to any of the following reasons:</p>
          <ul>
          <li>The computer time and the phone time don’t match. Enable automatic time synchronisation in your phone settings.</li>
          <li>The time in the Google Authenticator app is out of sync. In the Google Authenticator settings, tap ‘Time correction for codes’ and then ‘Sync now.’</li>
          <li>A VPN or proxy is enabled on your phone. Disable your VPN or proxy and try logging in again.</li>
          </ul>
          `,
        title3:
          "What should I do if I deleted the 2FA app or the code from it?",
        content3:
          "<p>If you uninstalled the Google Authenticator app or deleted the 2FA code from it but 2FA is enabled in your account, please contact our support desk. To create a ticket, click the ‘Help’ button in the bottom right corner of the page.</p>",
        title4:
          "What should I do if I made a mistake when entering the crypto address for a withdrawal?",
        content4: `
          <p>If you provided the wrong cryptocurrency address for a withdrawal and the status is shown as ‘Done,’ then it is impossible to cancel the withdrawal or return your cryptocurrency due to the technical specificities of blockchains.</p>
          <p>If your withdrawal shows the status ‘Pending,’ please contact our support desk.</p>
          <p>If your withdrawal shows the status ‘Waiting for confirmation,’ you can click ‘Cancel’ in the withdrawal transaction line in ‘Wallet History.’ After that, create a new withdrawal request to the valid address.</p>
          `,
        title5:
          "What should I do if I provided invalid personal details when signing up?",
        content5:
          "<p>Please contact our support desk. In the form provided, enter your valid details and attach documents proving their validity.</p>",
        title6: "What should I do if an exchange failed due to an error?",
        content6:
          "<p>An exchange transaction may fail if there are insufficient funds on your balance. Try decreasing the amount or contact our support desk. In the form, specify the error type that pops up in the top right corner of the screen.</p>",
        title7: "Why am I getting an error when placing an order?",
        content7: `
          <p>An error may occur during order placement due to one or more of the following reasons:</p>
          <ul class="dotted-list">
          <li>Violation of limit.</li>
          <li>One or more fields have been left unfilled when creating the order.</li>
          <li>Insufficient funds in your balance.</li>
          </ul>
          <p>You will see the exact cause of the error in the upper-right corner. Read this notification and try to change the amount or fill out all the fields correctly.</p>
          <p>If the above methods don’t yield any results, please contact our support desk.</p>`,
        title8:
          "Why haven’t I received an email with a link to activate my account or withdrawal?",
        content8: `
          <p>Message delivery failure may occur in the following cases:</p>
          <ul class="dotted-list">
          <li>You specified an invalid email address. Sign up again with a valid email address.</li>
          <li>The message went to your Spam folder. Check to see if your message is in your Spam folder. If it is, mark it as Not Spam so that in future our messages arrive directly to your Inbox and you notice them immediately.</li>
          </ul>  
          <p>If this still doesn’t solve the problem, please contact our support desk. If you do not receive a withdrawal confirmation message, you can have it sent again by clicking ‘Resend email with the code’ in the withdrawal transaction line in ‘Wallet History.’</p>
          `,
        title9:
          "Why haven’t I received any cryptocurrency even though the withdrawal transaction shows the ‘Done’ status?",
        content9:
          "Withdrawal delays may occur when a blockchain network is overloaded. Due to the queue of transactions, it may take miners up to several hours to confirm them. To find out what the status of your transaction is, click ‘Info’ in the withdrawal transaction line in ‘Wallet History.’",
      },
    },
  },
};

export default support;
