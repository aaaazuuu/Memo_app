document.addEventListener('DOMContentLoaded', function() {
    //タグ名入力欄・メモ入力欄・追加ボタン（メイン画面）
    const tagInput = document.getElementById('tagInput');
    const notesInput = document.getElementById('noteInput');
    const addNoteButton = document.getElementById('addNote');

    // タグフィルター（メイン画面）
    const tagFilter = document.getElementById('tagFilter');

    // 追加したタグ管理（メイン画面）
    const tagsContainer = document.querySelector('.Tags');

    // 編集画面
    const editContainer = document.querySelector('.ContainerRefact');
    const tagInputRefact = document.getElementById('tagInput_refact');
    const notesInputRefact = document.getElementById('noteInput_refact');

    // 選択画面
    const selectContainer = document.querySelector('.ContainerSelect');
    // 保存ボタン（編集画面)
    const saveButton = document.getElementById('save');
    // キャンセルボタン（編集画面)
    const cancelButton = document.getElementById('cancel');

    // メモ保存用リスト
    let notes = [];

    // メモ追加ボタンクリック時の処理
    addNoteButton.addEventListener('click', function () {
        const tag = tagInput.value.trim();
        const note = notesInput.value.trim();

        if (tag === "" || note === "") return;

        const noteObj = {tag, note};
        notes.push(noteObj);
        updateNotes();
        updateTagFilter();
        tagInput.value = '';
        notesInput.value = '';
    });

    //　メモ一覧を更新
    function updateNotes() {
        tagsContainer.innerHTML = '';
        notes.forEach((note, index) => {
            const noteEl = document.createElement('div');
            noteEl.classList.add('note-item');
            noteEl.innerHTML = `
                <span>${note.tag}</span>
                <button class="edit" data-index="${index}">編集</button>
                <button class="delete" data-index="${index}">削除</button>
                <button class="view" data-index="${index}">表示</button>
            `;
            tagsContainer.appendChild(noteEl);
        });

        // 編集ボタンクリック時の処理
        document.querySelectorAll('.edit').forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute('data-index');
                editContainer.removeAttribute('hidden');
                tagInputRefact.value = notes[index].tag;
                notesInputRefact.value = notes[index].note;
                saveButton.setAttribute('data-index', index);
            });
        });

        // 削除ボタンクリック時の処理
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute('data-index');
                notes.splice(index, 1);
                updateNotes();
                updateTagFilter();
            });
        });

        // 表示ボタンクリック時の処理
        document.querySelectorAll('.view').forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute('data-index');
                if (selectContainer.hasAttribute('hidden')) {
                    selectContainer.removeAttribute('hidden');
                    document.getElementById('tag_already').value = notes[index].tag;
                    document.getElementById('text_already').value = notes[index].note;
                } else {
                    selectContainer.setAttribute('hidden', 'true');
                }
            });
        });
    }

    // タグフィルターを更新
    function updateTagFilter() {
        uniqueTags = [];
        notes.forEach(note => {
            if (!uniqueTags.includes(note.tag)) {
                uniqueTags.push(note.tag);
            }
        });

        tagFilter.innerHTML = `<option value="all">全て</option>` + uniqueTags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
        tagFilter.value = 'all';
    }

    // タグフィルター変更時の処理
    tagFilter.addEventListener('change', function () {
        const selectedTag = tagFilter.value;
        updateNotes();
        if (selectedTag !== 'all') {
            document.querySelectorAll(".note-item").forEach(noteEl => {
                if (!noteEl.textContent.includes(selectedTag)) {
                    noteEl.style.display = 'none';
                }
            });
        }
    });

    //　編集内容を保存
    saveButton.addEventListener('click', function () {
        const index = this.getAttribute('data-index');
        notes[index].tag = tagInputRefact.value;
        notes[index].note = notesInputRefact.value;
        editContainer.setAttribute('hidden', 'true');
        updateNotes();
        updateTagFilter();
    });

    // 編集をキャンセル
    cancelButton.addEventListener('click', function () {
        editContainer.setAttribute('hidden', 'true');
    });

    // 初期表示
    updateNotes();
    updateTagFilter();
});