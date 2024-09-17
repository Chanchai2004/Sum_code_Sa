import { MembersInterface } from "../../interfaces/IMember";
import { MoviesInterface } from "../../interfaces/IMovie";  
import { ShowTimesInterface } from "../../interfaces/IShowtime";
import { TicketInterface } from "../../interfaces/ITicket";
import { BookingResponse } from "../../interfaces/IBooking"; // Import Interface ของ Tickets
import { RewardInterface  } from "../../interfaces/IReward"; 

const apiUrl = "http://localhost:8000/api";

// ฟังก์ชันเพื่อดึงข้อมูลสมาชิกทั้งหมด
async function GetMembers() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/members`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// ฟังก์ชันเพื่อดึงข้อมูลเพศทั้งหมด
async function GetGenders() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/genders`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// ฟังก์ชันเพื่อลบสมาชิกตาม ID
async function DeleteMemberByID(id: Number | undefined, adminID?: number, password?: string) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: password && adminID ? JSON.stringify({ password, adminID }) : undefined,  // ส่ง AdminID และ Password ถ้ามี
  };

  let res = await fetch(`${apiUrl}/members/${id}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return true;
      } else {
        return res.json().then((err) => Promise.reject(err));
      }
    })
    .catch((error) => {
      console.error("Error deleting member:", error);
      return false;
    });

  return res;
}

// ฟังก์ชันเพื่อดึงข้อมูลสมาชิกตาม ID
async function GetMemberById(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
  };

  let res = await fetch(`${apiUrl}/members/${id}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// ฟังก์ชันเพื่อสร้างสมาชิกใหม่
async function CreateMember(data: MembersInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/members`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}

// ฟังก์ชันเพื่ออัปเดตข้อมูลสมาชิก
async function UpdateMember(data: MembersInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/members/${data.ID}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// ฟังก์ชันเพื่อดึงข้อมูลหนังทั้งหมด
async function GetMovies() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/movies`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// ฟังก์ชันเพื่อดึงข้อมูลหนังตาม ID
async function GetMovieById(id: number | undefined) {
  if (id === undefined) {
    console.error("Movie ID is undefined");
    return false;
  }

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await fetch(`${apiUrl}/movie/${id}`, requestOptions);

    if (res.status === 200) {
      return await res.json();
    } else if (res.status === 404) {
      console.error("Movie not found");
      return false;
    } else {
      console.error("Failed to fetch movie, status code:", res.status);
      return false;
    }
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    return false;
  }
}


async function CreateMovie(formData: FormData) {
  const requestOptions = {
    method: "POST",
    body: formData,
  };

  let res = await fetch(`${apiUrl}/movies`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}


// ฟังก์ชันเพื่ออัปเดตข้อมูลหนัง
async function UpdateMovie(data: MoviesInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/movies/${data.ID}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// ฟังก์ชันเพื่อลบหนังตาม ID
async function DeleteMovieByID(id: Number | undefined) {
  const requestOptions = {
    method: "DELETE",
  };

  let res = await fetch(`${apiUrl}/movies/${id}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return true;
      } else {
        return false;
      }
    });

  return res;
}

// ฟังก์ชันเพื่อดึงข้อมูล Showtimes ทั้งหมด
async function GetShowtimes() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/showtimes`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// ฟังก์ชันเพื่อดึงข้อมูล Showtimes ตาม ID
async function GetShowtimeById(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/showtimes/${id}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// ฟังก์ชันเพื่อสร้าง Showtimes ใหม่
async function CreateShowtime(data: ShowTimesInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/showtimes`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}

// ฟังก์ชันเพื่ออัปเดตข้อมูล Showtimes
async function UpdateShowtime(data: ShowTimesInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/showtimes/${data.ID}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// ฟังก์ชันเพื่อลบ Showtimes ตาม ID
async function DeleteShowtimeByID(id: Number | undefined) {
  const requestOptions = {
    method: "DELETE",
  };

  let res = await fetch(`${apiUrl}/showtimes/${id}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return true;
      } else {
        return false;
      }
    });

  return res;
}

async function CheckAdminPassword(adminID: number, password: string) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: adminID, password }),  // ส่ง AdminID และ Password
  };

  let res = await fetch(`${apiUrl}/check-admin-password`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.success) {
        return { status: true };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}

// ฟังก์ชันเพื่อดึงข้อมูล Tickets ตาม ID
async function GetTicketById(id: Number | undefined) {
  if (!id || isNaN(Number(id))) {
    console.error("Invalid ID");
    return false;
  }

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`,
    },
  };

  let res = await fetch(`${apiUrl}/tickets/${id}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        console.error(`Error: Received status code ${res.status}`);
        return false;
      }
    })
    .catch(error => {
      console.error('Error fetching ticket:', error);
      return false;
    });

  return res;
}



// ฟังก์ชันเพื่อทำการจองที่นั่ง
async function bookSeats(showtimeID: number, theaterID: number, memberID: number, seats: string[]): Promise<BookingResponse> {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      showtime_id: showtimeID,
      theater_id: theaterID,
      member_id: memberID,
      seats: seats,
    }),
  };

  try {
    const response = await fetch(`${apiUrl}/book-seats`, requestOptions);
    const res = await response.json();

    if (res.success) {
      // คืนค่า ticketID จาก backend หากมีการส่งกลับมา
      return { success: true, message: res.message, ticketID: res.ticketID };
    } else {
      return { success: false, message: res.error || "Booking failed" };
    }
  } catch (error) {
    console.error('Error booking seats:', error);
    return { success: false, message: "Booking failed" };
  }
}

// ฟังก์ชันเพื่อดึงข้อมูลที่นั่งที่ถูกจองสำหรับ Showtime และ Theater
async function GetBookedSeats(showtimeID: number, theaterID: number) {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`${apiUrl}/booked-seats/${showtimeID}`, requestOptions);

    if (!response.ok) {
      console.error(`Error: Received status code ${response.status}`);
      return false; // ส่ง false หากการร้องขอล้มเหลว
    }

    const res = await response.json(); // แปลงข้อมูลจาก JSON
    return res; // ส่งผลลัพธ์ JSON กลับไป
  } catch (error) {
    console.error("Error fetching booked seats:", error); // จัดการข้อผิดพลาด
    return false; // ส่ง false หากมีข้อผิดพลาด
  }
}
// ฟังก์ชันเพื่อดึงข้อมูลรางวัลทั้งหมด
async function GetReward() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/rewards`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// ฟังก์ชันเพื่อดึงข้อมูลรางวัลตาม ID
async function GetRewardById(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/rewards/${id}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json(); // ถ้าสถานะเป็น 200 ส่งข้อมูลกลับมา
      } else {
        return false; // ถ้าไม่ใช่สถานะ 200 ส่งค่ากลับเป็น false
      }
    })
    .catch((error) => {
      console.error("Error fetching reward by ID:", error);
      return false; // ส่งกลับ false หากเกิดข้อผิดพลาด
    });

  return res; // ส่งข้อมูลรางวัลที่ได้กลับไป
}

async function CreateReward(data: RewardInterface) {
  // คัดลอกข้อมูล โดยตัด `id` และ `imageUrl` ออก
  const { ID, imageUrl, ...rewardDataWithoutIdAndImageUrl } = data;

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rewardDataWithoutIdAndImageUrl), // ส่งเฉพาะข้อมูลที่ต้องการ
  };

  let res = await fetch(`${apiUrl}/rewards`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}
const GetRewardsByMemberID = async (memberID: string) => {
  try {
      const response = await fetch(`${apiUrl}/mrewards/${memberID}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      console.log("Raw Response:", response);

      if (!response.ok) {
          // ถ้าไม่สำเร็จ อ่านข้อมูลจาก response.text() เพื่อดีบักข้อผิดพลาด
          const errorText = await response.text(); 
          console.error("Error response text:", errorText);
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // พยายามอ่านข้อมูล response.json() เพียงครั้งเดียว
      const data = await response.json();
      console.log("Data:", data); // ตรวจสอบข้อมูลที่ได้รับ
      return data;

  } catch (error) {
      console.error("Error fetching rewards:", error);
      throw error;
  }
  
};
// ฟังก์ชันสำหรับบันทึกโค้ด (POST)
const saveCodeReward = async (code: string, rewardId: number, memberId: string | null) => {
  try {
      const response = await fetch(`${apiUrl}/codereward`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              reward_code: code,
              reward_id: rewardId,
              member_id: memberId
          }),
      });

      if (!response.ok) {
          const errorText = await response.text();
          console.error("Error saving code:", errorText);
          throw new Error('Failed to save code');
      }

      const data = await response.json();
      return data; // คืนค่าผลลัพธ์ที่บันทึกลงฐานข้อมูล
  } catch (error) {
      console.error('Error saving code reward:', error);
      throw error;
  }
};




// ฟังก์ชันสำหรับตรวจสอบโค้ดรางวัล
const CheckCodeReward = async (code: string) => {
  try {
      const response = await fetch(`${apiUrl}/codereward?code=${code}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from server:", errorText); // แสดงข้อผิดพลาดจากเซิร์ฟเวอร์
          throw new Error('Failed to check code reward');
      }

      const data = await response.json();
      console.log("Response data from server:", data); // แสดงข้อมูลการตอบกลับจากเซิร์ฟเวอร์
      return data;
  } catch (error) {
      console.error("Error checking code reward:", error); // แสดง error หากไม่สามารถตรวจสอบโค้ดได้
      throw error;
  }
};

// ฟังก์ชันสำหรับตรวจสอบโค้ดแลกเปลี่ยน (GET)
const checkExistingCodeReward = async (rewardId: number) => {
try {
    const response = await fetch(`${apiUrl}/check-code-reward?reward_id=${rewardId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            console.warn("Code reward not found for reward_id:", rewardId);
            return null; // ถ้าไม่พบโค้ด ให้คืนค่า null
        }
        const errorText = await response.text();
        console.error("Error checking code:", errorText);
        throw new Error('Failed to check code reward');
    }

    const data = await response.json();
    return data;  // คืนค่าโค้ดที่มีอยู่ถ้ามี
} catch (error) {
    console.error('Error checking existing code reward:', error);
    throw error;
}
};






export {
  GetTicketById,
  GetMembers,
  CreateMember,
  GetGenders,
  DeleteMemberByID,
  GetMemberById,
  UpdateMember,
  GetMovies,
  GetMovieById,
  CreateMovie,
  UpdateMovie,
  DeleteMovieByID,
  GetShowtimes,
  GetShowtimeById,
  CreateShowtime,
  UpdateShowtime,
  DeleteShowtimeByID,
  bookSeats,
  GetBookedSeats,  // เพิ่มฟังก์ชัน GetBookedSeats เพื่อดึงข้อมูลที่นั่งที่ถูกจอง
  CheckAdminPassword,
  GetReward,
  GetRewardById,
  CreateReward,
  GetRewardsByMemberID,
  saveCodeReward,
  CheckCodeReward,
  checkExistingCodeReward
  
};
