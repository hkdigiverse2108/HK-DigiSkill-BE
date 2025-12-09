import { apiResponse } from "../../common";
import { courseModel, userCourseModel, userModel, workshopModel, workshopPaymentModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";

export const dashboard = async (req, res) => {
    reqInfo(req)
    try {
        let [sec1, sec2, sec3]: any = await Promise.all([
            (async () => {
                let dashboard = getDashboardData()
                return dashboard
            })(),
            (async () => {

            })()
        ])
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("dashboard"), { sec1, sec2, sec3 }, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
    }
}

export const getDashboardData = async () => {
    try {
        const totalStudents = await userModel.countDocuments({ isDeleted: false });
        const totalCourses = await courseModel.countDocuments({ isDeleted: false });
        const totalWorkshops = await workshopModel.countDocuments({ isDeleted: false });
        const workshopPurchaseCount = await workshopPaymentModel.countDocuments({ isDeleted: false })
        const coursePurchaseCount = await userCourseModel.countDocuments({ isDeleted: false })
        return {
            totalStudents, totalCourses, totalWorkshops, workshopPurchaseCount, coursePurchaseCount
        }

    } catch (error) {
        console.log("error:", error);
    }
};