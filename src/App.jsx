import React from "react";

export default function App() {
const today = new Date();

const [currentMonth, setCurrentMonth] = React.useState(new Date());
const [songs, setSongs] = React.useState(() => {
 const saved = localStorage.getItem("risusta-songs");
 return saved ? JSON.parse(saved) : [];
});
const [selectedDate, setSelectedDate] = React.useState(
today.toISOString().split("T")[0]
);
const [showModal, setShowModal] = React.useState(false);

const [title, setTitle] = React.useState("");
const [artist, setArtist] = React.useState("");
const [tags, setTags] = React.useState("");
const [searchText, setSearchText] = React.useState("");

const [editingId, setEditingId] = React.useState(null);

React.useEffect(() => {
localStorage.setItem(
"risusta-songs",
JSON.stringify(songs)
);
}, [songs]);

const touchStartX = React.useRef(0);

const year = currentMonth.getFullYear();
const month = currentMonth.getMonth();

const firstDay = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();

const getSongsForDate = (date) => {
return songs.filter((song) => song.date === date);
};

const addSong = () => {
if (!title.trim()) return;

setSongs((prev) => [
...prev,
{
 id: Date.now(),
 title,
 artist,
 tags: tags
 .split(",")
 .map((tag) => tag.trim())
 .filter(Boolean),
 date: selectedDate,
},
]);

setTitle("");
setArtist("");
setTags("");
setShowModal(false);
};
const deleteSong = (id) => {
setSongs((prev) => prev.filter((song) => song.id !== id));
};

const startEditSong = (song) => {
setEditingId(song.id);
setTitle(song.title);
setArtist(song.artist);
setTags((song.tags || []).join(", "));
setSelectedDate(song.date);
setShowModal(true);
};

const saveSong = () => {
setSongs((prev) =>
prev.map((song) =>
song.id === editingId
? {
...song,
title,
artist,
tags: tags
.split(",")
.map((tag) => tag.trim())
.filter(Boolean),
date: selectedDate,
}
: song
)
);

setEditingId(null);
setTitle("");
setArtist("");
setTags("");
setShowModal(false);
};



const cells = [];

for (let i = 0; i < firstDay; i++) {
cells.push(
<div
key={`empty-${i}`}
style={{ minHeight: "60px", visibility: "hidden" }}
/>
);
}

for (let day = 1; day <= daysInMonth; day++) {
const dateString = `${year}-${String(month + 1).padStart(
2,
"0"
)}-${String(day).padStart(2, "0")}`;

const daySongs = getSongsForDate(dateString);

const todayString = today.toISOString().split("T")[0];
const isToday = dateString === todayString;
const isSelected = dateString === selectedDate;

cells.push(
<div
key={day}
onClick={() => setSelectedDate(dateString)}
style={{
minHeight: "60px",
padding: "2px",
minWidth: 0,
borderRadius: "8px",
cursor: "pointer",
background: "#fff",
border:
 isToday && isSelected
 ? "2px solid #7c3aed"
 : isToday
 ? "2px solid #ef4444"
 : isSelected
 ? "2px solid #000000"
 : "1px solid #d1d5db",
}}
>
<div
style={{
fontWeight: "bold",
marginBottom: "8px",
color: isToday ? "#dc2626" : "#000",
}}
>
{day}
</div>

{daySongs.slice(0, 4).map((song) => (
<div
key={song.id}
style={{
fontSize: "12px",
background: "#dbeafe",
borderRadius: "4px",
padding: "2px 4px",
marginBottom: "4px",
overflow: "hidden",
textOverflow: "ellipsis",
whiteSpace: "nowrap",
}}
>
{song.title}
</div>
))}

{daySongs.length > 4 && (
<div style={{ fontSize: "12px", color: "#6b7280" }}>
+{daySongs.length - 4}曲
</div>
)}
</div>
);
}

const selectedSongs = getSongsForDate(selectedDate);
const searchResults = songs.filter((song) => {
const keyword = searchText.toLowerCase().trim();

if (!keyword) return false;

return (
song.title.toLowerCase().includes(keyword) ||
song.artist.toLowerCase().includes(keyword) ||
(song.tags || []).some((tag) =>
tag.toLowerCase().includes(keyword)
)
);
});

const handleTouchStart = (e) => {
touchStartX.current = e.touches[0].clientX;
};

const handleTouchEnd = (e) => {
const diff = e.changedTouches[0].clientX - touchStartX.current;

if (diff > 80) {
setCurrentMonth(new Date(year, month - 1, 1));
} else if (diff < -80) {
setCurrentMonth(new Date(year, month + 1, 1));
}
};

return (

<div
onTouchStart={handleTouchStart}
onTouchEnd={handleTouchEnd}
style={{
padding: "8px",
width: "100%",
touchAction: "pan-y",
}}
>

<h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
🎵 リススタカレンダー
</h1>

<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
margin: "16px 0",
}}
>
<button
onClick={() =>
setCurrentMonth(new Date(year, month - 1, 1))
}
>
前月
</button>

<h2
style={{
fontWeight: "bold",
transition: "all .25s ease",
}}
>
{year}年 {month + 1}月
</h2>




<button
onClick={() =>
setCurrentMonth(new Date(year, month + 1, 1))
}
>
次月
</button>
</div>

<input
placeholder="曲名・アーティスト・タグ検索"
value={searchText}
onChange={(e) => setSearchText(e.target.value)}
style={{
width: "100%",
padding: "10px",
marginBottom: "16px",
border: "1px solid #ddd",
borderRadius: "1px",
}}
/>
{searchText.trim() !== "" && (
<div
style={{
marginBottom: "24px",
border: "1px solid #ddd",
borderRadius: "1px",
padding: "16px",
}}
>
<h3>検索結果 ({searchResults.length}件)</h3>

{searchResults.map((song) => (
<div
key={song.id}
onClick={() => {
setSelectedDate(song.date);
setCurrentMonth(new Date(song.date));
}}
style={{
padding: "8px",
borderBottom: "1px solid #eee",
cursor: "pointer",
}}
>
<div>{song.title}</div>

<div style={{ color: "#666" }}>
{song.artist}
</div>

<div style={{ fontSize: "12px" }}>
{song.date}
</div>

<div
style={{
display: "flex",
gap: "4px",
flexWrap: "wrap",
marginTop: "4px",
}}
>
{(song.tags || []).map((tag) => (
<span
key={tag}
style={{
background: "#e5e7eb",
borderRadius: "999px",
padding: "2px 6px",
fontSize: "12px",
}}
>
#{tag}
</span>
))}
</div>
</div>
))}
</div>
)}

<div>
  <div style={{ width: "100%" }}>
<div
style={{
display: "grid",
gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
gap: "1px",
textAlign: "center",
fontWeight: "bold",
marginBottom: "8px",
}}
>
<div>日</div>
<div>月</div>
<div>火</div>
<div>水</div>
<div>木</div>
<div>金</div>
<div>土</div>
</div>

<div
style={{
display: "grid",
gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
gap: "1px",
}}
>
{cells}
</div>
</div>
</div>

<div
style={{
marginTop: "24px",
border: "1px solid #ddd",
borderRadius: "8px",
padding: "16px",
}}
>
<h3>{selectedDate} の記録</h3>

{selectedSongs.length === 0 ? (
<p>まだ登録がありません</p>
) : (
selectedSongs.map((song) => (
<div
key={song.id}
style={{
borderBottom: "1px solid #ddd",
padding: "8px 0",
}}
>
<div>{song.title}</div>

<div style={{ color: "#666", fontSize: "14px" }}>
{song.artist}
</div>
{song.tags?.length > 0 && (
<div
style={{
display: "flex",
flexWrap: "wrap",
gap: "4px",
marginTop: "4px",
}}
>
{song.tags.map((tag) => (
<span
key={tag}
style={{
background: "#e5e7eb",
padding: "2px 6px",
borderRadius: "999px",
fontSize: "12px",
}}
>
#{tag}
</span>
))}
</div>
)}

<div
style={{
display: "flex",
gap: "8px",
marginTop: "8px",
}}
>
<button
onClick={() => startEditSong(song)}
>
編集
</button>

<button
onClick={() => deleteSong(song.id)}
style={{
color: "red"
}}
>
削除
</button>
</div>

</div>
))
)}
</div>

<button
onClick={() => setShowModal(true)}
style={{
position: "fixed",
right: "16px",
bottom: "16px",
width: "56px",
height: "56px",
borderRadius: "9999px",
border: "none",
background: "#2563eb",
color: "#fff",
fontSize: "32px",
cursor: "pointer",
}}
>
+
</button>

{showModal && (
<div
style={{
position: "fixed",
inset: 0,
background: "rgba(0,0,0,.4)",
display: "flex",
justifyContent: "center",
alignItems: "center",
}}
>
<div
style={{
background: "#fff",
padding: "16px",
borderRadius: "12px",
width: "320px",
}}
>
<h2>
{editingId ? "曲を編集" : "曲を登録"}
</h2>


<p>日付: {selectedDate}</p>

<input
placeholder="曲名"
value={title}
onChange={(e) => setTitle(e.target.value)}
style={{ width: "100%", marginBottom: "8px" }}
/>

<input
placeholder="アーティスト名"
value={artist}
onChange={(e) => setArtist(e.target.value)}
style={{ width: "100%", marginBottom: "12px" }}
/>
<input
placeholder="タグ（カンマ区切り）"
value={tags}
onChange={(e) => setTags(e.target.value)}
style={{
width: "100%",
marginBottom: "12px",
}}
/>

<div style={{ display: "flex", gap: "8px" }}>
<button
onClick={editingId ? saveSong : addSong}
style={{ flex: 1 }}
>
{editingId ? "保存" : "登録"}
</button>


<button
onClick={() => setShowModal(false)}
style={{ flex: 1 }}
>
閉じる
</button>
</div>
</div>
</div>
)}
</div>
);
}
