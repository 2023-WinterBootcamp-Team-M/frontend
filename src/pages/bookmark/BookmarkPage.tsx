import React, { useState, useRef, useEffect } from 'react';
import DndContainer from '../../components/DragNDrop';
import axios from 'axios';
import { favoriteStore, optStore, userIdStore } from '../../store/store';
import ToolTip from '../../components/ToolTip';
import NewFolderModal from '../../components/bookmark/NewFolderModal';
import NewBookmarkModal from '../../components/bookmark/NewBookmarkModal';
import { domain } from '../../domain/domain';

interface BookmarkFolder {
  id: number;
  name: string;
  url: string;
  bookmarks: Bookmark[];
}

interface Bookmark {
  id: number;
  name: string;
  url: string;
  icon: string;
  long_summary: string;
  shrot_summary: string;
}

interface BookmarkPageProps {
  name: string;
}

const BookmarkPage: React.FC<BookmarkPageProps> = ({ name }) => {
  const [selectedFolder, setSelectedFolder] = useState<BookmarkFolder | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkName, setBookmarkName] = useState('');
  const [bookmarkUrl, setBookmarkUrl] = useState('');
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>([]);
  const [folderName, setFolderName] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isBookmarkFormVisible, setIsBookmarkFormVisible] = useState(false);
  const [isBookmarkAuto, setIsBookmarkAuto] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const { userId } = userIdStore();
  const { favoriteBookmarks, setFavoriteBookmarks } = favoriteStore();
  const { opt_sum,opt_theme } = optStore();

  const getURL =  () => {
    setBookmarkUrl(window.location.href);
  }
  // 선택한 폴더 업데이트
  const handleFolderClick = (folder: BookmarkFolder) => {
    if (selectedFolder && selectedFolder.id === folder.id) {
      setSelectedFolder(null);
    } else {
      setSelectedFolder(folder);
    }
    console.log('선택된 폴더:', selectedFolder);
  };

  const handlePopoverClick = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setSelectedFolder(null);
    }
  };

  // 유저의 폴더 조회
  const handleFolderFetch = async (user_id: number | null) => {
    try {
      const response = await axios.get(`${domain}/api/v1/folders/list/${user_id}`);
      setBookmarkFolders(response.data);
      console.log('폴더조회 성공:', response.data);
    } catch (err) {
      console.error('Error fetching folders:', err);
    }
  };

  // 폴더 내부의 북마크 조회
  const bookmarkFetch = async (folder_id: number) => {
    try {
      const response = await axios.get(`${domain}/api/v1/bookmarks/${folder_id}`);
      console.log(`${folder_id} 폴더의 북마크 조회 성공:`, response.data);
      setBookmarks(response.data);
    } catch (err) {
      console.error(`${folder_id}북마크 조회 실패 :`, err);
    }
  };

  // 폴더 생성
  const handleFolderCreateSubmit = async (event: React.FormEvent, user_id: number | null) => {
    event.preventDefault();

    try {
      const jsonData = { name: folderName, user_id: user_id };
      const response = await axios.post(`${domain}/api/v1/folders`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 새롭게 생성된 폴더를 bookmarkFolders 상태에 추가
      setBookmarkFolders((prevFolders) => [...prevFolders, response.data]);
      console.log('폴더 생성 성공 :', response.data);

      // 폼 입력을 지우고 폼을 숨김
      setFolderName('');
      setIsFormVisible(false);
    } catch (error) {
      console.error('폴더 생성 오류:', error);
    }
  };

  // 폴더 삭제
  const handleFolderDelete = async (folder_id: number) => {
    try {
      await axios.delete(`${domain}/api/v1/folders/${folder_id}`);
      setBookmarkFolders((prevFolders) => prevFolders.filter((folder) => folder.id !== folder_id));

      if (selectedFolder && selectedFolder.id === folder_id) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error('폴더 삭제 오류:', error);
    }
  };

  // 폴더 이름 수정
  const handleFolderEditSubmit = async (event: React.FormEvent, folder_id: number) => {
    event.preventDefault();
    try {
      const jsonData = {
        name: folderName,
      };
      const response = await axios.patch(`${domain}/api/v1/folders/${folder_id}`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      setBookmarkFolders((prevFolders) =>
        prevFolders.map((folder) => (folder.id === folder_id ? { ...folder, name: response.data.name } : folder))
      );

      setEditingFolderId(null);
    } catch (error) {
      console.error('폴더 편집 오류:', error);
    }
  };

  //북마크 생성
  const createBookmark = async (event, folderId, bookmarkName, url) => {
    event.preventDefault();

    try {
      const jsonData = {
        folder_id: folderId,
        name: bookmarkName,
        url: url,
      };
      const response = await axios.post(`${domain}/api/v1/bookmarks`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setBookmarks((prevBookmarks) => [...prevBookmarks, response.data]);
      console.log(bookmarkFolders, bookmarks);
      console.log('북마크 생성 성공 :', response.data);
      // 폼 입력을 지우고 폼을 숨김
      setFolderName('');
      setBookmarkName('');
      setBookmarkUrl('');
      setIsBookmarkFormVisible(false);
    } catch (error) {
      console.error('북마크 생성 오류:', error);
    }
  };

  //북마크 자동생성
  const createBookmarkAuto = async (event, bookmarkName, url, bookmarkFolders) => {
    event.preventDefault();

    try {
      const jsonData = {
        name: bookmarkName,
        url: url,
      };
      console.log(jsonData);
      const response = await axios.post(`${domain}/api/v1/bookmarks/list/${userId}`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // 새로 생성된 폴더가 이미 상태에 존재하는지 확인
      const folderExists = bookmarkFolders.some((folder) => folder.id === response.data.folder.id);

      // 폴더가 존재하지 않으면 상태에 추가
      if (!folderExists) {
        setBookmarkFolders((prevFolders) => [...prevFolders, response.data.folder]);
      }
      // 새롭게 생성된 폴더를 bookmarkFolders 상태에 추가
      setBookmarks((prevBookmarks) => [...prevBookmarks, response.data.bookmark]);

      console.log('북마크 생성 성공 :', response.data);
      // 폼 입력을 지우고 폼을 숨김
      setBookmarkName('');
      setBookmarkUrl('');
      setIsBookmarkAuto(false);
    } catch (error) {
      console.error('북마크 생성 오류:', error);
    }
  };

  //북마크 즐겨찾기 조회
  const fetchFavorite = async () => {
    try {
      const response = await axios.get(`${domain}/api/v1/favorite/bookmarks/${userId}`);
      setFavoriteBookmarks(response.data);
      console.log('favoritebookmark:', favoriteBookmarks);
      console.log('북마크 즐겨찾기 조회 성공 :', response.data);
    } catch (err) {
      console.error('북마크 즐겨찾기 조회 실패 :', err);
    }
  };

  //폴더생성 클릭시
  const handleFolderCreateClick = () => {
    setIsFormVisible((prevIsFormVisible) => !prevIsFormVisible);
    setIsBookmarkFormVisible(false);
    setIsBookmarkAuto(false);
    setFolderName('');
  };
  //북마크생성 클릭시
  const handleBookmarkCreateClick = () => {
    setIsBookmarkFormVisible((prevIsBookmarkFormVisible) => !prevIsBookmarkFormVisible);
    setIsFormVisible(false);
    setIsBookmarkAuto(false);
    setBookmarkName('');
  };
  //폴더자동분류 북마크 생성 클릭시
  const handleAutoBookmarkCreateClick = () => {
    setIsBookmarkAuto((prevIsBookmarkFormVisible) => !prevIsBookmarkFormVisible);
    setIsBookmarkFormVisible(false);
    setIsFormVisible(false);
    setFolderName('');
  };
  //폴더수정 클릭시
  const handleFolderEditClick = (folderId: number) => {
    setEditingFolderId(folderId);
    setFolderName(bookmarkFolders.find((folder) => folder.id === folderId)?.name || '');
  };

  useEffect(() => {
    handleFolderFetch(userId);
    fetchFavorite();
    document.addEventListener('mousedown', handlePopoverClick);
    return () => {
      document.removeEventListener('mousedown', handlePopoverClick);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen items-center px-5 relative">
      <div className="w-full h-[19%] absolute -z-20 rounded-b-md bg-cliptab-blue" />
      <div className="w-full h-[82%] bottom-0 rounded-t-lg bg-[#fcfcfc] absolute -z-10 shadow-top" />
      <img //로고 이미지
        className={`w-[11.75rem] h-[4.8125rem] z-10 ${opt_theme ? "desaturate":""}`}
        src={` ${opt_theme ? "https://i.ibb.co/YhgZ89r/Cliptab-1-4.png" : "https://i.ibb.co/d73mffp/clip-tab-3.png" }`}
        alt="clip_tab_logo"
      />
      <p className={`self-start py-2 z-20 ${opt_theme ? "text-dark-text" : "text-cliptab-text"} `}>북마크 생성</p>
      <div
        className={`flex flex-col items-center justify-evenly mx-auto w-full h-full rounded-[20px] py-2 shadow-xl mb-4 ${opt_theme ? "bg-dark-component" : "bg-white"}`}
      >
        <div className="flex w-[95%] h-[20%] justify-center mb-2 mx-auto">
          <button
            onClick={handleFolderCreateClick}
            className={`rounded-l-lg px-2 py-0 hover:opacity-90 text-xs ${opt_theme ? "bg-dark-btn text-dark-text" : "bg-cliptab-blue text-white"}`}
          >
            폴더 생성
          </button>
          <button
            onClick={()=>
              {handleBookmarkCreateClick()
              getURL()
            }}
            className={`px-2 py-0 hover:opacity-90 text-xs ${opt_theme ? "bg-dark-btn text-dark-text" : "bg-cliptab-blue text-white"}`}
          >
            북마크 생성
          </button>
          <button
            onClick={()=>{
            handleAutoBookmarkCreateClick()
            getURL()}}
            className={`rounded-r-lg px-2 py-0 hover:opacity-90 text-xs ${opt_theme ? "bg-dark-btn text-dark-text" : "bg-cliptab-blue text-white"}`}
          >
            자동분류 북마크 생성
          </button>
        </div>
        {
          !isFormVisible && !isBookmarkAuto && !isBookmarkFormVisible && (
            <div className={`text-cliptab-blue h-[60%] flex justify-evenly items-center flex-col `}>
            <img className="w-[20%]" src="https://i.ibb.co/3M1P51n/free-sticker-folders-11384146.png" alt="free-sticker-folders-11384146"/>
            <p className={` flex justify-center items-center lg:text-sm xl:text-lg ${opt_theme ? "text-dark-text" : "text-cliptab-blue"}`}>북마크를 추가해보세요!</p>
            </div>
          )
        }
        {/* 폴더생성 */}
        {isFormVisible && !isBookmarkAuto &&!isBookmarkFormVisible && (
        <NewFolderModal
          isVisible={isFormVisible}
          folderName={folderName}
          setFolderName={setFolderName}
          handleFolderCreateSubmit={(event) => handleFolderCreateSubmit(event, userId)}
          setIsFormVisible={setIsFormVisible}
        />
        )}
        {isBookmarkAuto && !isBookmarkFormVisible && !isFormVisible  &&(
        <form
          onSubmit={(event) => createBookmarkAuto(event, bookmarkName, bookmarkUrl, bookmarkFolders)}
          className={`flex flex-col justify-center mx-auto w-[90%] h-full rounded-[20px] shadow-xl  p-4 ${opt_theme ? " bg-dark-btn": "bg-white border-2 border-blue-400"}`}
        >
          <label className={`md:text-xs lg:text-xs my-auto  ${opt_theme ? "text-dark-text" : "text-cliptab-blue"}`}>
            북마크 이름
            <input
              type="text"
              value={bookmarkName}
              onChange={(e) => setBookmarkName(e.target.value)}
              placeholder="북마크 이름을 입력하세요"
              className={`rounded px-2 py-1 text-xs w-full ${opt_theme ? "bg-dark-component focus:outline-none text-white" : "border-2 border-cliptab-blue focus:outline-[#3e95ff] text-gray-700"}`}
            />
          </label>
          <label className={`md:text-xs lg:text-xs my-auto  ${opt_theme ? "text-dark-text" : "text-cliptab-blue"}`}>
            URL
            <input
              type="text"
              value={bookmarkUrl}
              onChange={(e) => setBookmarkUrl(e.target.value)}
              placeholder="url을 입력하세요"
              className={`rounded px-2 py-1 text-xs w-full ${opt_theme ? "bg-dark-component focus:outline-none text-white" : "border-2 border-cliptab-blue focus:outline-[#3e95ff] text-gray-700"}`}
            />
          </label>
          <div className='flex flex-row justify-between w-full mt-2'>
          <button type="submit" className={` rounded-lg py-1 hover:opacity-90 text-sm w-[48%] ${opt_theme ? "bg-dark-bg/30 text-white" : "bg-cliptab-blue text-white"}`}>
            생성
          </button>
          <button type="reset" className={` rounded-lg py-1 hover:opacity-90 text-sm w-[48%] ${opt_theme ? "bg-dark-text" : "bg-white text-cliptab-blue border border-cliptab-blue"}`}>
            취소
          </button>
          </div>
        </form>
      )}
      {/* 북마크 생성 */}
      {isBookmarkFormVisible  && !isBookmarkAuto && !isFormVisible && (
      <NewBookmarkModal
        isVisible={isBookmarkFormVisible}
        bookmarkName={bookmarkName}
        bookmarkUrl={bookmarkUrl}
        setBookmarkName={setBookmarkName}
        setBookmarkUrl={setBookmarkUrl}
        createBookmark={(event) => createBookmark(event, selectedFolder?.id, bookmarkName, bookmarkUrl)}
        setIsBookmarkFormVisible={setIsBookmarkFormVisible}
      />)}
      </div>
      <p className={`self-start py-2 ${opt_theme ? "text-dark-text" : "text-gray-400"}`}>북마크</p>

      <div
        className={`mx-auto w-full min-h-60 max-h-80 overflow-auto rounded-[20px] shadow-xl mb-4 py-2 ${
          selectedFolder ? 'h-max' : 'h-min'
        } ${opt_theme ? "bg-dark-component":"bg-white"}`}
      >
        

        {bookmarkFolders.length === 0 ? (
          <div className="flex flex-col w-full h-full justify-evenly items-center">
            <img src="https://i.ibb.co/xgbw95k/pngegg.png" alt="empty_img" className=" w-[30%] h-[40%]" />
            <p className="text-center text-cliptab-blue lg:text-sm xl:text-lg">북마크를 추가해보세요!</p>
          </div>
        ) : (
          <ul className="text-sm leading-10 h-full w-[80%] mx-auto">
            {bookmarkFolders.map((folder) => (
              <React.Fragment key={folder.id}>
                <li className="flex items-center w-full justify-between">
                  {editingFolderId === folder.id ? (
                    <form
                      onSubmit={(e) => {
                      handleFolderEditSubmit(e, folder.id)
                      setEditingFolderId(null)}}
                      className={`flex flex-col justify-center mx-auto w-full h-[60%]  rounded-[20px] shadow-xl  p-4 ${opt_theme ? " bg-dark-btn": "bg-white border-2 border-blue-400"}`}
                    >
                      <div className='flex justify-evenly items-center w-full'>
                      <p className={`text-sm my-auto  ${opt_theme ? "text-dark-text" : "text-cliptab-blue"}`}>북마크 이름</p>
                      <input
                        type="text"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        className={`rounded px-2 py-1 text-xs w-[60%] ${opt_theme ? "bg-dark-component focus:outline-none text-white" : "border-2 border-cliptab-blue focus:outline-[#3e95ff] text-gray-700"}`}
                      />
                      </div>
                      <div className='flex justify-evenly mt-4'>
                      <button
                      type='submit'
                      className={` rounded-lg py-1 hover:opacity-90 text-sm w-[45%] ${opt_theme ? "bg-dark-bg/30 text-white" : "bg-cliptab-blue text-white"}`}>수정</button>
                      <button 
                      onClick={()=>{setEditingFolderId(null)}}
                      className={` rounded-lg py-1 hover:opacity-90 text-sm w-[45%] ${opt_theme ? "bg-dark-text" : "bg-white text-cliptab-blue border border-cliptab-blue"}`}>취소</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex flex-row items-center">
                        <img className="w-4 h-4 mr-2 flex items-end" src="https://i.ibb.co/nsvNYV1/folder.png" alt="Folder Icon" />
                        <p
                          className="cursor-pointer ml-3"
                          onClick={() => {
                            handleFolderClick(folder);
                            bookmarkFetch(folder.id);
                          }}
                        >
                          {folder.name}
                        </p>
                      </div>
                      <div className="flex flex-row">
                        <img
                          src="https://i.ibb.co/4KDg9K1/edit-02.png"
                          onClick={() => handleFolderEditClick(folder.id)}
                          className="focus:outline-none w-5 h-5"
                        />
                        <img
                          className="focus:outline-none w-5 h-5 ml-2"
                          src="https://i.ibb.co/sFMqmQf/delete-2.png"
                          onClick={() => handleFolderDelete(folder.id)}
                        />

                      </div>
                    </>
                  )}
                </li>
                {selectedFolder && selectedFolder.id === folder.id && (
                  <div className={`w-full h-60 rounded-[20px] overflow-auto shadow-xl mb-4 mx-auto py-2 ${opt_theme ? "bg-dark-btn" : "bg-[#DFEBFF] "}`}>
                    {/* 선택된 폴더의 북마크 목록 */}
                    <DndContainer post={bookmarks} setPost={setBookmarks} fetch={fetchFavorite}>
                      {bookmarks.map((bookmark) => (
                        <li key={bookmark.id} className="flex items-center">
                          {/* 북마크 항목 */}
                        </li>
                      ))}
                    </DndContainer>
                  </div>
                )}
              </React.Fragment>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col items-start mx-auto w-full h-full my-auto pb-2">
        <p className={`self-start py-2 ${opt_theme ? "text-dark-text" : "text-gray-400"}`}>즐겨찾기한 북마크</p>
        <div
          className={`mx-auto my-auto w-full rounded-[20px] shadow-xl h-full flex justify-center ${opt_theme ? "bg-dark-component" : "bg-white"}`}
        >
          {favoriteBookmarks.length === 0 ? (
            <div className="flex flex-col w-full h-full justify-evenly items-center">
              <img src="https://i.ibb.co/LNy0Wnj/pngegg-1.png" alt="empty_img" className="w-[50%] h-[60%]" />
              <p className="text-center text-cliptab-blue lg:text-sm xl:text-lg">즐겨찾기에 북마크를 추가해보세요!</p>
            </div>
          ) : (
            <ul className="text-sm leading-10 w-[80%] h-[80%] mx-auto my-auto">
              {favoriteBookmarks.map((favorite) => (
                <li key={favorite.name} className="flex items-center">
                  <img className="w-4 h-4 mr-2" src={favorite.icon} alt={`${favorite.name}-icon`} />
                  <ToolTip title={opt_sum ? favorite.short_summary : favorite.long_summary}>
                    <a href={favorite.url} target="_blank" rel="noopener noreferrer">
                      {favorite.name}
                    </a>
                  </ToolTip>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
export default BookmarkPage;
