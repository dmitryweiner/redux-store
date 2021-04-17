# Пример стора, разбитого на разные файлы
Сделано по мотивам вот [этого репозитория](https://codesandbox.io/s/9on71rvnyo),
и [вот этого](https://codesandbox.io/s/3x6jx7p0r6).

Внимание! Во избежание циклических импортов и непонятных ошибок:
1. Глобальный initialState должен лежать в индексе стора.
2. initialState отдельных слайсов должны лежать там же, где их редьюсеры.

[Демонстрация ошибок при разделении стора](https://youtu.be/LIra64O9juo).
