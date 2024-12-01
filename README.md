# Домашнее задание к занятию "3.Обработка событий"

![CI](https://github.com//NadinDesyatova/ahj-tasks/actions/workflows/web.yml/badge.svg)

### TOP Tasks

Реализован трекер задач, в котором есть возможность отображать назначенные пользователю задачи. 

Пользователь может фильтровать и добавлять задачи с помощью поля ввода. Некоторые задачи можно закреплять ("pinned").

#### Описание

1. Задачи можно добавлять при следующих условиях: в поле ввода есть текст и пользователь нажал "Enter" (если текста нет, но пользователь всё равно нажал "Enter" выводится сообщение об ошибке.
2. При добавлении задачи задача добавляется в блок "All Tasks", а поле ввода очищается
3. Когда закреплённых задач нет, в блоке "Pinned" отображается текст "No pinned tasks"
4. Когда закреплённые задачи есть, они отображаются в блоке "Pinned" и не участвуют в процедуре фильтрации:
    * их отображение никак не зависит от состояния фильтра
    * они не отображаются в блоке "All Tasks"
5. При пустом поле ввода в блоке "All Tasks" отображаются все задачи с учётом условий предыдущего пункта (т.е. все, кроме "Pinned")
6. При изменении поля ввода содержимое блока "All Tasks" автоматически пересчитывается - отображаются только те задачи, в названии которых есть подстрока, введеная в поле ввода (без учёта регистра)
7. Если значению поля ввода не удовлетворяет ни одна из задач, то в блоке "All Tasks" отображается текст "No tasks found"
8. При выставлении переключателя (круглая иконка справа) задача из блока "All Tasks" попадает в "Pinned"
9. При снятии переключателя (круглая иконка справа) задача из блока "Pinned" попадает в блок "All Tasks" (при этом учитывайте состояние фильтра)

Все задачи хранятся в массиве в памяти JS. Каждая задача представляет собой объект класса "Task". 
Перестройка DOM-дерева происходит на основании объектов, хранящихся в памяти.

---
