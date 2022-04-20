package org.lamisplus.modules.hiv.domain.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@Data
public class HivEnrollmentDTO {

    private Long id;

    private String uniqueId;

    private Long entryPointId;

    private Long targetGroupId;

    private LocalDate dateConfirmedHiv;

    //private LocalDate dateEnrolledPMTCT;

    private String sourceOfReferrer;

    //private LocalDateTime timeHivDiagnosis;

    private Long tbStatusId;

    private Boolean pregnant;

    private Boolean breastfeeding;

    private LocalDate dateOfRegistration;

    private Long statusAtRegistrationId;

    private Long enrollmentSettingId;

   // private LocalDate dateStarted;

    private Boolean sendMessage;

    private Long personId;

    private String uuid;

    private int archived;

    private String facilityName;

    private String ovcNumber;

    //private LocalDate dateOfLpm;

    private Long pregnancyStatusId;
}
